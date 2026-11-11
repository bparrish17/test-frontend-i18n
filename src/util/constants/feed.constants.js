import { startOfQuarter, startOfToday, startOfWeek, startOfYear, subDays } from 'date-fns';

export const dateRangeMenuItems = [
  {
    name: 'All Dates'
  },
  {
    name: 'Today',
    createdAtFrom: startOfToday(new Date())
  },
  {
    name: 'Current Week',
    createdAtFrom: startOfWeek(new Date())
  },
  {
    name: 'Past 7 Days',
    createdAtFrom: subDays(new Date(), 7)
  },
  {
    name: 'Past 30 Days',
    createdAtFrom: subDays(new Date(), 30)
  },
  {
    name: 'Current Quarter',
    createdAtFrom: startOfQuarter(new Date())
  },
  {
    name: 'Current Fiscal Year',
    createdAtFrom: startOfYear(new Date())
  }
];

export const DOCUMENT_FILE_EXTENSIONS_ACCEPTED = [
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'csv',
  'txt'
];
