import { useState, useEffect } from 'react';

/**
 * Calculates a date N days in the future from today's present date
 * Format: "Day, D Month" (e.g. "Sat, 1 Aug")
 */
export function getFutureDateString(daysToAdd = 6): string {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysToAdd);
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayName = daysOfWeek[targetDate.getDay()];
  const dayNum = targetDate.getDate();
  const monthName = months[targetDate.getMonth()];
  
  return `${dayName}, ${dayNum} ${monthName}`;
}

/**
 * Calculates delivery date + time string (e.g. "Sat, 1 Aug, 7 am - 10 pm")
 */
export function getFutureDeliveryString(daysToAdd = 6, timeRange = "7 am - 10 pm"): string {
  return `${getFutureDateString(daysToAdd)}, ${timeRange}`;
}

/**
 * React hook for safe SSR/client rendering of dynamic dates (+6 days from present date)
 */
export function useDeliveryDate(daysToAdd = 6): string {
  const [dateStr, setDateStr] = useState<string>(() => getFutureDateString(daysToAdd));

  useEffect(() => {
    setDateStr(getFutureDateString(daysToAdd));
  }, [daysToAdd]);

  return dateStr;
}

/**
 * React hook for safe delivery text (+6 days from present date with time window)
 */
export function useDeliveryText(daysToAdd = 6, timeRange = "7 am - 10 pm"): string {
  const [deliveryText, setDeliveryText] = useState<string>(() => getFutureDeliveryString(daysToAdd, timeRange));

  useEffect(() => {
    setDeliveryText(getFutureDeliveryString(daysToAdd, timeRange));
  }, [daysToAdd, timeRange]);

  return deliveryText;
}
