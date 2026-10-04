export interface Registration {
  id: string;
  eventName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: string;
}

export function formatRegistrationDate(date: string) {
  return new Intl.DateTimeFormat('es-BO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(date));
}

export function formatRegistrationTime(time: string) {
  return new Intl.DateTimeFormat('es-BO', {
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'UTC',
  }).format(new Date(time));
}
