
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  if (minutes < 1440) { // Less than 24 hours
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    
    return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
  }
  
  if (minutes < 43200) { // Less than 30 days (approx)
    const days = Math.floor(minutes / 1440);
    const remainingHours = Math.floor((minutes % 1440) / 60);
    
    if (remainingHours === 0) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    }
    
    return `${days} day${days !== 1 ? 's' : ''} ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
  }
  
  // For longer durations, show in months
  const months = Math.floor(minutes / 43200); // Approximate month = 30 days
  const remainingDays = Math.floor((minutes % 43200) / 1440);
  
  if (remainingDays === 0) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  
  return `${months} month${months !== 1 ? 's' : ''} ${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
};
