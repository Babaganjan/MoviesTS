// fetchSession.tsx;
const fetchSession = async (): Promise<string> => {
  const options: RequestInit = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNWY4NzcwNWNlYzYyZTA4YWNjZmY2NTRjMjJjZmJmZSIsIm5iZiI6MTczNjA2NjM0My4yODcwMDAyLCJzdWIiOiI2NzdhNDUyNzgyY2NlMTVhNzY3NGViOTciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.IlVjxE4hOBNTPyyuWZQx2hOZB9DWHSmZFMcLveFZ8AU',
    },
  };

  try {
    const response = await fetch(
      'https://api.themoviedb.org/3/authentication/guest_session/new',
      options,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: { success: boolean;
      guest_session_id?: string;
      status_message?: string } = await response.json();

    if (data.success) {
      if (data.guest_session_id) {
        return data.guest_session_id;
      }
      throw new Error('Гостевая сессия не была создана.');
    } else {
      throw new Error(`Ошибка при создании гостевой сессии: ${data.status_message}`);
    }
  } catch (error) {
    throw new Error(`Ошибка при выполнении запроса к API: ${error instanceof Error ? error.message : 'неизвестная ошибка'}`);
  }
};

export default fetchSession;
