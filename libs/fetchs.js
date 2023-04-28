export const fetcher = async (url, result, year, month, day) => {
    return fetch(
      `${url.base}latitude=${result[0].lat}&longitude=${result[0].lon}&start_date=${year}-01-01&end_date=${year}-${month}-${day}&daily=temperature_2m_max,temperature_2m_min,rain_sum&timezone=auto`
    ).then((res1) => res1.json());
  };