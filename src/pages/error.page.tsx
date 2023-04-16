import { useRouteError } from 'react-router-dom';

type ResponseError = {
  status: number;
  statusText: string;
  message: string;
  data: any;
};

export const ErrorPage = () => {
  const error = useRouteError() as ResponseError;
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
};
