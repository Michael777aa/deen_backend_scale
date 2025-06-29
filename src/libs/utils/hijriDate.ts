export function getCurrentHijriDate(): {
  day: number;
  month: number;
  year: number;
  monthName: string;
} {
  const now = new Date();
  const gregorianYear = now.getFullYear();

  // Approximate Hijri year
  const hijriYear =
    gregorianYear - 622 + Math.floor((gregorianYear - 622) / 32);

  const months = [
    "Muharram",
    "Safar",
    "Rabi al-Awwal",
    "Rabi al-Thani",
    "Jumada al-Awwal",
    "Jumada al-Thani",
    "Rajab",
    "Shaʿban",
    "Ramadan",
    "Shawwal",
    "Dhu al-Qiʿdah",
    "Dhu al-Hijjah",
  ];

  // Very rough month/day mapping
  const hijriMonthIndex = (now.getMonth() + 9) % 12; // shift so Jan→10, Feb→11, Mar→0, …
  const hijriDay = now.getDate();

  return {
    day: hijriDay,
    month: hijriMonthIndex + 1,
    year: hijriYear,
    monthName: months[hijriMonthIndex],
  };
}

export function getUpcomingIslamicEvents(): Array<{
  title: string;
  date: string;
  hijriDate: string;
  daysRemaining: number;
}> {
  const now = new Date();
  const currentYear = now.getFullYear();

  const rawEvents = [
    {
      title: "Laylat al-Bara'at",
      date: new Date(currentYear, 3, 15), // April 15
      hijriDate: "15 Shaʿban 1445",
    },
    {
      title: "First day of Ramadan",
      date: new Date(currentYear, 4, 1), // May 1
      hijriDate: "1 Ramadan 1445",
    },
  ];

  return rawEvents
    .map((evt) => {
      const diffMs = evt.date.getTime() - now.getTime();
      const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return {
        title: evt.title,
        date: evt.date.toISOString(),
        hijriDate: evt.hijriDate,
        daysRemaining,
      };
    })
    .filter((evt) => evt.daysRemaining > 0)
    .sort((a, b) => a.daysRemaining - b.daysRemaining);
}
