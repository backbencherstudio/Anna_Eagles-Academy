
export const handleLogout = (api: any) => {
    try {
        if (typeof document !== 'undefined') {
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }

        if (api?.dispatch) {
            api.dispatch({ type: 'auth/logout' });
        }
    } catch (_) {
    }
};
