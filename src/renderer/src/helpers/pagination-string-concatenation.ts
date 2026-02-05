export function paginationStringConcatenation(url: string, parameterOverRide?: string) {
  return url + '?page=0&limit=50' + (parameterOverRide ?? '')
}
