export default class UtilsService {
  public static formatErrors (errors: string[]) {
    return {
      errors: errors.map(message => ({
        rule: 'custom',
        field: 'custom',
        message,
      })),
    }
  }
}
