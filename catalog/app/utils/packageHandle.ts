interface Options {
  username?: string
  directory?: string
}

const VALUE_TEMPLATE = /\$\{\{([^}]*)\}\}/

export function getValueName(valueTemplate: string): string | null {
  const found = valueTemplate.match(VALUE_TEMPLATE)
  return found && found.length ? found[1].trim() : null
}

export function convertRegexItem(template: string, options?: Options): string | null {
  if (!options) return template
  const regexp = new RegExp(VALUE_TEMPLATE, 'g')
  try {
    return template.replace(regexp, (match) => {
      const valueName = getValueName(match) as keyof Options
      if (valueName && options[valueName] !== null && options[valueName] !== undefined)
        return options[valueName]!
      throw new Error('No match')
    })
  } catch (error) {
    return null
  }
}

export function convertItem(template: string, options?: Options): string | null {
  if (template.includes('${{')) return convertRegexItem(template, options)
  return template
}

export function convert(templates: string[], options?: Options): string {
  let handle = ''
  templates.some((template) => {
    const converted = convertItem(template, options)
    if (converted === null) return false
    handle = converted
    return true
  })
  return handle
}
