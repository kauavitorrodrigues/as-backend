export const getCurrentDate = () => {
    return Intl.DateTimeFormat('pt-br').format(new Date());
}