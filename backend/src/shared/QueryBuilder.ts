import { FilterQuery, Model, QueryOptions, SortOrder } from 'mongoose'

type TQueryOptions = {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: SortOrder
  search?: string
  searchFields?: string[]
  filter?: Record<string, any>
  select?: string
}

class QueryBuilder<T> {
  private model: Model<T>
  private query: FilterQuery<T>
  private options: QueryOptions = {}
  private populate: { path: string; select?: string }[] = []

  constructor(model: Model<T>, query: FilterQuery<T>) {
    this.model = model
    this.query = query
  }

  search(searchFields: string[] = [], searchTerm?: string): this {
    if (!searchTerm || searchFields.length === 0) return this

    const searchRegex = new RegExp(searchTerm, 'i')
    const searchQuery: any = searchFields.map(field => ({
      [field]: { $regex: searchRegex },
    }))
    this.query.$or = searchQuery

    return this
  }

  filter(filterOptions: Record<string, any> = {}): this {
    if (Object.keys(filterOptions).length === 0) return this

    Object.entries(filterOptions).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        ;(this.query as any)[key] = value
      }
    })

    return this
  }

  sort(sortBy?: string, sortOrder: SortOrder = 'desc'): this {
    if (!sortBy) return this

    this.options.sort = { [sortBy]: sortOrder }
    return this
  }

  pagination(page: number = 1, limit: number = 10): this {
    const skip = (page - 1) * limit
    this.options.skip = skip
    this.options.limit = limit

    return this
  }

  select(fields: string = ''): this {
    if (!fields) return this

    this.options.projection = fields.split(',').join(' ')
    return this
  }

  addPopulate(path: string, select?: string): this {
    this.populate.push({ path, select })
    return this
  }

  async getTotalCount(): Promise<number> {
    return this.model.countDocuments(this.query)
  }

  async getPaginatedData(): Promise<{
    data: T[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    const data = await this.model
      .find(this.query, '', this.options)
      .populate(this.populate)

    const total = await this.getTotalCount()
    const page = this.options.skip
      ? Math.floor(this.options.skip / (this.options.limit || 10)) + 1
      : 1
    const limit = this.options.limit || 10
    const totalPages = Math.ceil(total / limit)

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    }
  }

  async getData(): Promise<T[]> {
    return this.model.find(this.query, '', this.options).populate(this.populate)
  }

  async getSingleData(): Promise<T | null> {
    return this.model.findOne(this.query).populate(this.populate)
  }
}

export default QueryBuilder
