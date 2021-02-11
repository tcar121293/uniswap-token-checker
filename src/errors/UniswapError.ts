export class UniswapError extends Error {
  public wrap (err: Error): this {
    this.stack += '\n' + err.stack
    return this
  }
}
