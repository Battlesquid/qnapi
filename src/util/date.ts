export const toYYYYMMDD = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthPadding = month < 10 ? "0" : "";
    const day = date.getDate();
    const dayPadding = day < 10 ? "0" : "";
    return `${year}-${monthPadding}${month}-${dayPadding}${day}`;
}

export const fromYYYYMMDD = (date: string) => {
    const [year, month, day] = date.split("-");
    return new Date(parseInt(year), parseInt(month), parseInt(day))
}
