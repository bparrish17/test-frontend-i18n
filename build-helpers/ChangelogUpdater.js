import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { execSync } from 'child_process';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import dotenv from 'dotenv';
import { Octokit } from '@octokit/rest';
import { WebClient } from '@slack/web-api';

dotenv.config();

class ChangelogUpdater {
  constructor(isProdRelease = false) {
    console.log('Initializing ChangelogUpdater...');
    this.changelogPath = path.resolve('CHANGELOG.md');
    this.changelogJsonPath = path.resolve('build-helpers/', 'changelog.json');
    this.prodChangelogPath = path.resolve('PROD-CHANGELOG.md');
    this.JIRA_BASE_URL = 'https://foraday.atlassian.net';
    this.JIRA_USERNAME = 'jsg@fora.day';
    this.JIRA_API_TOKEN = process.env.JIRA_TOKEN;
    console.log('JIRA token last 3 chars:', this.JIRA_API_TOKEN?.slice(-3));
    this.ISSUE_TYPE_MAPPING = {
      Task: 'Tasks',
      Bug: 'Bug Fixes',
      Story: 'Features',
      Epic: 'Epics',
      'Sub-task': 'SubTasks',
      Subtask: 'SubTasks'
    };
    this.isProdRelease = isProdRelease;
    this.buildDate = format(new Date(), 'EEE, MMM d yyyy');
    const estTimeZone = 'America/New_York';
    this.buildTime = format(utcToZonedTime(new Date(), estTimeZone), 'hh:mm a zzz', {
      timeZone: estTimeZone
    })
      .replace('GMT-7', 'EST')
      .replace('GMT+0', 'EST');

    // Initialize Octokit and Slack clients
    this.octokit = new Octokit({
      auth: process.env.PAT_TOKEN
    });
    this.slack = new WebClient(process.env.SLACK_TOKEN);

    this.initialize();
  }

  async initialize() {
    console.log('Initializing changelog updater...');

    if (!this.isProdRelease) {
      // Only get ticket ID and Jira info for dev releases
      await this.getCurrentBranchName();
      await this.fetchJiraTicketInfo();
    }

    return {
      buildDate: this.buildDate,
      buildTime: this.buildTime,
      ticketId: this.ticketId
    };
  }

  getCurrentBranchName() {
    console.log('Getting current branch name...');
    const branchName = process.env.BRANCH_NAME;
    console.log('Branch name from environment:', branchName);

    if (branchName) {
      const match = branchName.match(/FORA-\d+/);
      if (match) {
        console.log('Found ticket ID in branch name:', match[0]);
        this.ticketId = match[0];
        return match[0];
      }
    }

    try {
      const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
      console.log('Branch name from git command:', branch);
      const match = branch.match(/FORA-\d+/);
      if (match) {
        console.log('Found ticket ID in git branch:', match[0]);
        this.ticketId = match[0];
        return match[0];
      }
    } catch (error) {
      console.error('Error getting branch from git:', error.message);
    }

    throw new Error('Could not find FORA ticket ID in branch name');
  }

  async fetchJiraTicketInfo() {
    console.log('Fetching Jira ticket info for:', this.ticketId);
    const encodedAuth = Buffer.from(`${this.JIRA_USERNAME}:${this.JIRA_API_TOKEN}`).toString(
      'base64'
    );

    try {
      const response = await axios.get(
        `${this.JIRA_BASE_URL}/rest/api/latest/issue/${this.ticketId}`,
        {
          headers: {
            Authorization: `Basic ${encodedAuth}`,
            Accept: 'application/json'
          }
        }
      );

      if (!response?.data?.fields?.summary) {
        console.error('Unexpected response format:', JSON.stringify(response.data, null, 2));
        throw new Error('Invalid response format from Jira');
      }

      this.title = response.data.fields.summary;
      this.type = this.ISSUE_TYPE_MAPPING[response.data.fields.issuetype.name];
      this.link = `${this.JIRA_BASE_URL}/browse/${this.ticketId}`;
      console.log('Fetched ticket info:', {
        title: this.title,
        type: this.type,
        link: this.link
      });
    } catch (error) {
      console.error('Error fetching Jira ticket:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }

  getCommitMessages() {
    console.log('Getting commit messages...');
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    console.log('Current branch:', currentBranch);

    try {
      let commits;
      if (process.env.GITHUB_EVENT_PATH) {
        // In GitHub Actions, get commits from the PR
        const eventData = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
        const prNumber = eventData.pull_request.number;
        console.log('Getting commits from PR #', prNumber);

        // Get the base and head refs from the PR
        const baseRef = eventData.pull_request.base.sha;
        const headRef = eventData.pull_request.head.sha;
        console.log('PR refs:', { baseRef, headRef });

        // Get all commits between base and head
        commits = execSync(`git log --pretty=format:"%h %s" ${baseRef}..${headRef}`)
          .toString()
          .trim();

        console.log('Raw commits:', commits);
      } else {
        // Local development - get commits since branching from dev
        const mergeBase = execSync('git merge-base dev HEAD').toString().trim();
        console.log('Merge base:', mergeBase);
        commits = execSync(`git log ${mergeBase}..HEAD --pretty=format:"%h %s"`).toString().trim();
      }

      this.commitMessages = commits.split('\n').filter(Boolean);
      console.log('Found', this.commitMessages.length, 'commits:', this.commitMessages);
    } catch (error) {
      console.error('Error getting commit messages:', error);
      this.commitMessages = [];
    }
  }

  formatCommitMessages() {
    return this.commitMessages
      .map((msg) => {
        const [hash, ...messageParts] = msg.split(' ');
        const message = messageParts.join(' ');
        return `    - [${message}](https://github.com/summarizator/fora-frontend/commit/${hash})`;
      })
      .join('\n');
  }

  updateChangelogContent(formattedEntry = null) {
    console.log('Starting changelog content update...');

    // Get version from package.json
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    this.version = packageJson.version;

    // Calculate previous version
    const currentVersion = this.version.split('.').map(Number);
    currentVersion[2] -= 1;
    this.previousVersion = currentVersion.join('.');

    let newEntry;
    if (formattedEntry) {
      // Use provided entry (for prod releases)
      newEntry = formattedEntry;
    } else {
      // Generate new entry for dev releases
      const releaseType = this.isProdRelease
        ? '<span style="color: red;">[prod]</span>'
        : '<span style="color: green;">[dev]</span>';

      const formattedCommitMessages = this.formatCommitMessages();

      newEntry = `## [${this.version}](https://github.com/summarizator/fora-frontend/compare/v${this.previousVersion}...v${this.version}) ${releaseType}
> ${this.buildDate} | ${this.buildTime}

### ${this.type}

- [${this.ticketId}](${this.link}): ${this.title}

  <details>
    <summary>Commits</summary>

${formattedCommitMessages}

  </details>

`;
    }

    // Read existing content and update
    const existingContent = fs.readFileSync(this.changelogPath, 'utf8');
    const headerLines = existingContent.split('\n').slice(0, 2);
    const newContent = `${headerLines.join('\n')}\n\n${newEntry}${existingContent
      .split('\n')
      .slice(2)
      .join('\n')}`;

    fs.writeFileSync(this.changelogPath, newContent, 'utf8');
    console.log('Changelog updated successfully');

    this.latestEntry = newEntry;
  }

  updateChangelogJson() {
    console.log('Updating changelog.json...');
    console.log('Reading from:', this.changelogJsonPath);

    let changelogJsonContent = [];
    if (fs.existsSync(this.changelogJsonPath)) {
      const jsonContent = fs.readFileSync(this.changelogJsonPath, 'utf8').trim();
      if (jsonContent) {
        try {
          changelogJsonContent = JSON.parse(jsonContent);
          console.log('Existing entries in changelog.json:', changelogJsonContent.length);
        } catch (error) {
          console.error('Error parsing changelog.json:', error);
          changelogJsonContent = [];
        }
      }
    } else {
      console.log('changelog.json does not exist, will create new file');
    }

    console.log('Preparing new changelog entry...');
    console.log('Commit messages available:', !!this.commitMessages);

    const newChangelogEntry = {
      version: this.version,
      date: this.buildDate,
      time: this.buildTime,
      type: this.type || 'Other',
      isProdRelease: this.isProdRelease,
      ticket: {
        id: this.ticketId,
        title: this.title,
        link: this.link,
        commits: Array.isArray(this.commitMessages)
          ? this.commitMessages.map((msg) => {
              const [hash, ...messageParts] = msg.split(' ');
              const message = messageParts.join(' ');
              return {
                message,
                link: `https://github.com/summarizator/fora-frontend/commit/${hash}`
              };
            })
          : []
      }
    };

    console.log('New changelog entry:', {
      version: newChangelogEntry.version,
      isProdRelease: newChangelogEntry.isProdRelease,
      ticketId: newChangelogEntry.ticket.id,
      commitCount: newChangelogEntry.ticket.commits.length
    });

    changelogJsonContent.unshift(newChangelogEntry);
    console.log(
      'Writing updated changelog.json with',
      changelogJsonContent.length,
      'total entries'
    );

    fs.writeFileSync(
      this.changelogJsonPath,
      JSON.stringify(changelogJsonContent, null, 2) + '\n',
      'utf8'
    );
    console.log('Successfully updated changelog.json');
  }

  async updateChangelog() {
    console.log('Starting changelog update process...');
    console.log('isProdRelease:', this.isProdRelease);

    if (this.isProdRelease) {
      console.log('Executing production release flow...');
      await this.updateProdChangelog();
    } else {
      console.log('Executing development release flow...');
      await this.initialize();
      this.getCommitMessages();
      await this.updateChangelogContent();
      console.log('Updating changelog.json for development release...');
      this.updateChangelogJson();
      await this.sendProdReleaseNotesToSlack();
    }
    console.log('Changelog update process completed');
  }

  updateProdChangelog() {
    console.log('Updating production changelog...');
    console.log('isProdRelease:', this.isProdRelease);

    // Get version from package.json first
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    this.version = packageJson.version;
    console.log('Current version:', this.version);

    // Calculate previous version
    const currentVersion = this.version.split('.').map(Number);
    currentVersion[2] -= 1;
    this.previousVersion = currentVersion.join('.');
    console.log('Previous version:', this.previousVersion);

    // Read the changelog.json
    console.log('Reading changelog.json for production update...');
    if (!fs.existsSync(this.changelogJsonPath)) {
      console.error('changelog.json not found at:', this.changelogJsonPath);
      throw new Error('changelog.json not found');
    }

    const changelogJsonContent = JSON.parse(fs.readFileSync(this.changelogJsonPath, 'utf8').trim());
    console.log('Found', changelogJsonContent.length, 'total entries in changelog.json');

    // Update changelog.json with the new production entry
    console.log('Updating changelog.json for production release...');
    this.updateChangelogJson();

    // Get all entries since last prod release and dedupe by ticket id
    const lastProdIndex = changelogJsonContent.findIndex((entry) => entry.isProdRelease);
    console.log('Last prod release index:', lastProdIndex);

    const entriesToInclude = changelogJsonContent.slice(
      0,
      lastProdIndex === -1 ? undefined : lastProdIndex
    );
    console.log(`Found ${entriesToInclude.length} entries to include in prod release`);

    // Group entries by ticket ID to merge commits
    const ticketMap = new Map();
    entriesToInclude.forEach((entry) => {
      const id = entry?.ticket?.id;
      if (!id) return;

      if (!ticketMap.has(id)) {
        ticketMap.set(id, {
          type: entry.type,
          ticket: entry.ticket,
          commits: []
        });
      }

      // Merge commits
      const currCommits = entry?.ticket?.commits;
      if (Array.isArray(currCommits)) {
        ticketMap.get(id).commits.push(...currCommits);
      } else if (typeof currCommits === 'string') {
        ticketMap.get(id).commits.push(currCommits);
      }
    });

    // Convert merged entries back to array and group by type
    const mergedEntries = Array.from(ticketMap.values());
    console.log(`Merged into ${mergedEntries.length} unique tickets`);

    // Group entries by type
    const groupedEntries = {};
    mergedEntries.forEach((entry) => {
      console.log('Processing entry:', {
        id: entry?.ticket?.id,
        type: entry.type,
        title: entry?.ticket?.title?.substring(0, 30) + '...',
        commitCount: entry.commits.length
      });

      if (!groupedEntries[entry.type]) {
        groupedEntries[entry.type] = [];
      }
      groupedEntries[entry.type].push(entry);
    });

    const types = Object.keys(groupedEntries);
    console.log('Entry types:', types);

    // Format the new prod entry
    console.log('Formatting production entry...');
    const formattedEntry = `## [${
      this.version
    }](https://github.com/summarizator/fora-frontend/compare/v${this.previousVersion}...v${
      this.version
    }) <span style="color: red;">[prod]</span>
> ${this.buildDate} | ${this.buildTime}

${types
  .map((type) => {
    const entries = groupedEntries[type];
    console.log(`Processing ${entries.length} entries for type ${type}`);
    return `### ${type}

${entries
  .map((entry) => {
    const currID = entry?.ticket?.id;
    const currTitle = entry?.ticket?.title;
    const currCommits = entry.commits;

    if (!currID) {
      console.warn('Entry missing id:', entry);
      return '';
    }
    console.log(`Processing entry ${currID}: ${currTitle?.substring(0, 30)}...`);

    // Format commits - ensure it's a string with each commit on a new line
    const formattedCommits = Array.isArray(currCommits)
      ? currCommits.map((commit) => `    - [${commit.message}](${commit.link})`).join('\n')
      : typeof currCommits === 'string'
      ? currCommits
      : currCommits?.toString() || '';

    return `- [${currID}](https://foraday.atlassian.net/browse/${currID}): ${currTitle}
  <details>
    <summary>Commits</summary>

${formattedCommits}

  </details>

`;
  })
  .join('')}`;
  })
  .join('\n')}`;

    this.latestEntry = formattedEntry;

    console.log('Entry formatted, length:', formattedEntry.length);

    // Store the latest prod entry for GitHub release and Slack notification
    this.latestEntry = formattedEntry;

    // Update prod changelog by inserting at the top
    console.log('Reading existing prod changelog...');
    const existingProdChangelogContent = fs.existsSync(this.prodChangelogPath)
      ? fs.readFileSync(this.prodChangelogPath, 'utf8')
      : '';
    console.log('Existing prod changelog length:', existingProdChangelogContent.length);

    // Clean up any duplicate headers in the existing content
    const cleanedContent = existingProdChangelogContent
      .replace(/^# Prod Changelog\n\nAll prod builds documented here\n\n/gm, '')
      .replace(/# Prod Changelog\n\nAll prod builds documented here\n\n/g, '');

    const title = '# Prod Changelog\n\nAll prod builds documented here\n\n';
    const updatedProdChangelogContent = title + formattedEntry + cleanedContent;

    console.log('Writing updated prod changelog...');
    fs.writeFileSync(this.prodChangelogPath, updatedProdChangelogContent, 'utf8');
    console.log('Production changelog updated successfully');

    // Update main changelog
    console.log('Updating main changelog...');
    this.updateChangelogContent(formattedEntry);

    // Create GitHub release and send Slack notification
    return Promise.all([this.createReleaseinGithub(), this.sendProdReleaseNotesToSlack()]).catch(
      (error) => {
        console.error('Error in post-changelog tasks:', error);
        throw error;
      }
    );
  }

  async sendProdReleaseNotesToSlack() {
    console.log('Sending release notes to Slack...');

    try {
      // Extract the version and changelog content
      const version = this.version;
      const channelId = this.isProdRelease
        ? process.env.SLACK_CHANNEL_ID
        : process.env.SLACK_DEV_CHANNEL_ID;

      console.log(`Using Slack channel: ${this.isProdRelease ? 'Production' : 'Development'}`);

      // Get the changelog content
      let changelogContent = this.latestEntry;
      if (!changelogContent) {
        throw new Error('No changelog content available to send to Slack');
      }

      console.log('Original changelog length:', changelogContent.length);

      // Format the content for Slack
      changelogContent = changelogContent
        // Remove commit details
        .replace(/<details>[\s\S]*?<\/details>/g, '')
        // Convert version header to Slack format
        .replace(/^## \[(.*?)\].*?\[prod\]<\/span>/m, 'Version $1 [PROD]')
        // Convert section headers to Slack format
        .replace(/^### (.*?)$/gm, '*$1*')
        // Convert Jira links to Slack format
        .replace(
          /\[(FORA-\d+)\]\(https:\/\/[^)]+\)/g,
          '<https://foraday.atlassian.net/browse/$1|$1>'
        )
        // Clean up HTML
        .replace(/<span[^>]*>/g, '')
        .replace(/<\/span>/g, '')
        // Add emoji bullet points
        .replace(/^- /gm, '• ')
        // Ensure proper spacing
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        // Clean up any remaining markdown links (but not our Jira links)
        .replace(/\[([^\]]+)\]\((?!https:\/\/foraday\.atlassian\.net)[^)]+\)/g, '$1')
        .trim();

      console.log('Changelog length after formatting:', changelogContent.length);
      console.log('Formatted content:', changelogContent);

      // Try to join the channel first
      try {
        console.log('Attempting to join Slack channel...');
        await this.slack.conversations.join({ channel: channelId });
        console.log('Successfully joined channel');
      } catch (joinError) {
        console.log(
          'Could not join channel, might already be a member or need manual invite:',
          joinError.message
        );
      }

      // Format the message for Slack
      const message = {
        channel: channelId,
        text: `🚀 New ${this.isProdRelease ? 'Production' : 'Development'} Release v${version}`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `🚀 New ${
                this.isProdRelease ? 'Production' : 'Development'
              } Release v${version}`,
              emoji: true
            }
          },
          {
            type: 'divider'
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: changelogContent
            }
          },
          {
            type: 'divider'
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `*Released:* ${this.buildDate} at ${this.buildTime}`
              }
            ]
          }
        ]
      };

      console.log('Sending Slack message...');
      const result = await this.slack.chat.postMessage(message);
      console.log('Slack notification sent successfully:', result.ts);
    } catch (error) {
      console.error('Error sending Slack notification:', error);
      throw error;
    }
  }

  async createReleaseinGithub() {
    console.log('Creating GitHub release...');

    try {
      const tagName = `v${this.version}`;
      const releaseName = `Production Release v${this.version}`;

      // Create the release using Octokit
      const release = await this.octokit.repos.createRelease({
        owner: 'summarizator',
        repo: 'fora-frontend',
        tag_name: tagName,
        name: releaseName,
        body: this.latestEntry,
        target_commitish: 'app', // target branch
        prerelease: false,
        draft: false
      });

      console.log('GitHub release created successfully:', release.data.html_url);
      return release.data;
    } catch (error) {
      console.error('Error creating GitHub release:', error);
      throw error;
    }
  }
}

const isProdRelease = process.argv.includes('--prod');
console.log('Starting changelog updater with isProdRelease:', isProdRelease);
const changelogUpdater = new ChangelogUpdater(isProdRelease);
changelogUpdater.updateChangelog().catch((error) => {
  console.error('Error updating changelog:', error);
  process.exit(1);
});
