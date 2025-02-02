// fetchSession.tsx;
const fetchSession = async (): Promise<string> => {
  const apiToken = import.meta.env.VITE_API_TOKEN;

  // Проверка наличия токена в localStorage
  const storedToken = localStorage.getItem('apiToken');
  if (!storedToken && apiToken) {
    localStorage.setItem('apiToken', apiToken); // Сохраните токен в localStorage, если его еще нет
  }

  // Используйте токен из localStorage для запроса
  const tokenToUse = storedToken || apiToken;

  const options: RequestInit = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${tokenToUse}`,
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
