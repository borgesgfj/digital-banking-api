export class HandleTime {
  static timeStamp() {
    return new Date().toISOString().replace(/\.\d{3}/, '');
  }

  static dateDifference(
    currentTimeStamp: string,
    lastTimeStamp: string,
  ): number {
    return Math.abs(Date.parse(currentTimeStamp) - Date.parse(lastTimeStamp));
  }
}
