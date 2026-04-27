export const getLoggedInUser = () => {
    try {
        const userString = localStorage.getItem('user');
        return userString ? JSON.parse(userString) : null;
    } catch (e) {
        console.error("Error parsing user from localStorage", e);
        return null;
    }
};

export const getUserRole = () => {
    const user = getLoggedInUser();
    return user?.rol || user?.codigo || 'USER';
};

export const hasRole = (roleCode) => {
    const userRole = getUserRole();
    return userRole?.toUpperCase() === roleCode?.toUpperCase();
};
