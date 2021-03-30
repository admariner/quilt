import lodashTemplate from 'lodash/template'

type Context = 'files' | 'packages'

type HandlesDict = Partial<Record<Context, string>>

type Options = {
  username?: string
  directory?: string
}

export function convertItem(template: string, options?: Options): string | null {
  try {
    return lodashTemplate(template)(options)
  } catch (error) {
    return null
  }
}

export function convert(
  handlesDict: HandlesDict,
  context: Context,
  options?: Options,
): string {
  return convertItem(handlesDict[context] || '', options) || ''
}
