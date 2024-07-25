export class RefreshTokenDto {
  private constructor(public refreshToken: string) {}

  static create(payload: { [key: string]: any }): [string?, RefreshTokenDto?] {
    const { refreshToken } = payload
    if (!refreshToken) return ['Missing refresh token']

    return [undefined, new RefreshTokenDto(refreshToken)]
  }
}