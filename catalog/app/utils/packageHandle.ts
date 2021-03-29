interface Options {
  username?: string
  directory?: string
}

const VALUE_TEMPLATE = /\$\{\{([^}]*)\}\}/

export function getValueName(valueTemplate: string): string {
  const found = valueTemplate.match(VALUE_TEMPLATE)
  return found && found.length ? found[1].trim() : ''
}

export function convertRegexItem(template: string, options?: Options): string {
  if (!options) return template
  const regexp = new RegExp(VALUE_TEMPLATE, 'g')
  return template.replace(regexp, (match) => {
    const valueName = getValueName(match) as keyof Options
    if (!valueName) return match
    return options[valueName] || match
    return match
  })
}

export function convertItem(template: string, options?: Options): string {
  if (template.includes('${{')) return convertRegexItem(template, options)
  return template
}

export function convert(templates: string[], options?: Options): string {
  let handle = ''
  templates.some((template) => {
    handle = convertItem(template, options)
    return !!handle
  })
  return handle
}
