import core from '@actions/core';
import github from '@actions/github';
// import Axios from 'axios';

const sonarBranchURL =
  'https://sonarcloud.io/dashboard?id=joe-repos_test&branch=BRANCH_NAME&resolved=false';
const sonarPRURL = `https://sonarcloud.io/summary/new_code?id=joe-repos_test&pullRequest=PR_NUMBER`;
let URL;

try {
  // console.log(core);
  console.log('ENV PR Number:', process?.env?.PR_NUMBER);
  console.log('CYPRESS URL:', process?.env?.CYPRESS_URL);
  // console.log('ENV Webhook URL', process?.env?.SLACK_WEBHOOK_URL);
  let { ref } = github.context;

  if (ref.includes('refs/heads/')) {
    console.log('Branch Found');
    ref = ref.replace('refs/heads/', '');
    URL = sonarBranchURL.replace('BRANCH_NAME', process?.env?.PR_NUMBER);
  } else if (ref.includes('refs/pull/')) {
    console.log('PR Found');
    ref = ref.replace('refs/pull/', '');
    ref = ref.replace('/merge', '');
    URL = sonarPRURL.replace('PR_NUMBER', process?.env?.PR_NUMBER);
  } else {
    console.log('No Branch or PR Found, ref is:', ref);
  }
  console.log('Replace done, Ref is:', ref);
  console.log('SonarURL is:', URL);

  core.exportVariable('sonarURL', URL);
  core.setOutput('sonarURL', URL);
  core.setOutput('branch', ref);
  core.notice(`Sonar Scan for branch ${ref} is complete. View the results here: ${URL}`);

  // Axios.post(
  //   process?.env?.SLACK_WEBHOOK_URL,
  //   {
  //     text: `
  //     👀 Sonar Scan for branch ${ref} is complete. View the results here:
  //     ${URL}`
  //   },
  //   {
  //     headers: {
  //       'Content-type': 'application/json'
  //     }
  //   }
  // );
} catch (error) {
  core.setFailed(error.message);
}
