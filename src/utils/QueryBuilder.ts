type Comparison = '==' | '!=' | '<' | '>' | '<=' | '>=' | 'in' | 'match'

type FilterValue = string | number | boolean

class QueryBuilder {
  private _fields: string[] = []
  private _filters: string[] = []
  private _orders: string[] = []
  private _selector: string = ''

  private formatValue = (value: FilterValue) => (typeof value === 'string' ? `"${value}"` : value)

  where(name: string, value: FilterValue, comparison: Comparison = '==') {
    switch (comparison) {
      case 'in':
        this._filters.push(`${this.formatValue(value)} in ${name}`)
        break
      case 'match':
        this._filters.push(`${name} match "*${value}*"`)
        break
      default:
        this._filters.push(`${name} ${comparison} ${this.formatValue(value)}`)
    }
    return this
  }

  whereIn(name: string, value: FilterValue[]) {
    this._filters.push(`${name} in [${value.map(this.formatValue).join(', ')}]`)
    return this
  }

  private addWhereGroup(query: QueryBuilder, join: 'or' | 'and') {
    this._filters.push(`(${query._filters.join(join === 'or' ? ' || ' : ' && ')})`)
    return this
  }

  whereOr(query: QueryBuilder) {
    return this.addWhereGroup(query, 'or')
  }

  whereNot(query: QueryBuilder) {
    this._filters.push(`!(${query})`)
    return this
  }

  whereAnd(query: QueryBuilder) {
    return this.addWhereGroup(query, 'and')
  }

  whereRaw(rawFilter: string) {
    this._filters.push(rawFilter)
    return this
  }

  defined(name: string) {
    this._filters.push(`defined(${name})`)
    return this
  }

  orderBy(name: string, order: 'desc' | 'asc' = 'desc') {
    this._orders.push(`${name} ${order}`)
    return this
  }

  range(from: number, to: number, inclusive: boolean = false) {
    this._selector = `[${from}..${inclusive ? '.' : ''}${to}]`
    return this
  }

  static getField(name: string, alias?: string) {
    return alias ? `"${alias}": ${name}` : name
  }

  static getImageField = (name: string, alias?: string) =>
    this.getField(name + '.asset->{url, metadata{lqip, dimensions{width, height}}}', alias)

  static getLocalizedField(name: string, locale: string, alias?: string) {
    let localeSuffix = locale === 'ru' ? '' : locale[0].toUpperCase() + locale.slice(1)
    return QueryBuilder.getField(name + localeSuffix, alias)
  }

  addField(name: string, alias?: string) {
    this._fields.push(QueryBuilder.getField(name, alias))
    return this
  }

  addFields(names: string[]) {
    names.forEach((name) => this.addField(name))
    return this
  }

  fetchOne() {
    this._selector = '[0]'
    return this
  }

  private generateFilters() {
    return this._filters.length ? `*[${this._filters.join(' && ')}]` : ''
  }

  private generateOrders() {
    return this._orders.length ? ` | order(${this._orders.join(', ')})` : ''
  }

  private generateFields() {
    return this._fields.length ? '{' + this._fields.join(', ') + '}' : ''
  }

  build() {
    return this.generateFilters() + this.generateOrders() + this._selector + this.generateFields()
  }

  toString() {
    return this.build()
  }
}

export default QueryBuilder
