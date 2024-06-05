function setQuizStartTime(quizId: string) {
  const now = new Date();
  const cookieValue = encodeURIComponent(now.toISOString());
  const cookieName = `quizStartTime:${quizId}`;
  const expiryDays = 1;
  const expiryDate = new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000);
  document.cookie = `${cookieName}=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/`;
}

function getQuizStartTime(quizId: string) {
  const cookieName = `quizStartTime:${quizId}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return new Date(cookie.substring(cookieName.length, cookie.length));
    }
  }
  return null;
}

/**
 * durationInMinutes: should be the duration in minutes!
 * fromTime: The time which we are determining the estimate
 * Note: Returns the remaining time in secs!
 *  */
function getRemainingTime(durationInMinutes: number, fromTime: Date) {
  const startTime = fromTime.getTime();
  const now = new Date().getTime();
  const elapsedTime = (now - startTime) / 1000;
  const totalDurationInSeconds = durationInMinutes * 60;
  const remainingTime = totalDurationInSeconds - elapsedTime;
  const roundedRemainingTime = Math.max(0, Math.floor(remainingTime));

  return roundedRemainingTime;
}

export { setQuizStartTime, getQuizStartTime, getRemainingTime };
