// fetchSession.tsx;
const fetchSession = async (): Promise<string> => {
  const apiToken = import.meta.env.VITE_API_TOKEN;

  if (!localStorage.getItem('apiToken')) {
    localStorage.setItem('apiToken', apiToken);
  }

  // Проверяем, установлен ли токен
  if (!apiToken) {
    throw new Error('Токен недоступен: проверьте .env файл или переменные окружения');
  }

  const options: RequestInit = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiToken}`,
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
