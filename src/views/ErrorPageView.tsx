import { useRouteError } from 'react-router-dom';

export const ErrorPage = () => {
    const error = useRouteError();

    // console.log('error', error)

    return <h2>Oh no, we've encountered an error :-/: {error.error}</h2>;

    // : {error.error}
};
