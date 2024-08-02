export class RefreshTokenDto {
  private constructor(public refreshToken: string) {}

  static create(payload: { [key: string]: any }): [string?, RefreshTokenDto?] {
    const { refresh_token } = payload
    if (!refresh_token) return ['Missing refresh token']

    return [undefined, new RefreshTokenDto(refresh_token)]
  }
}