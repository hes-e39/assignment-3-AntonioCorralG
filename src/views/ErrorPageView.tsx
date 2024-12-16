
export const ErrorPage = ({ error }: { error: Error }) => {
    return (
        <div>
            <h2>Oh no, we've encountered an error :-/</h2>
            <pre>{error.message}</pre>
        </div>
    );


};
