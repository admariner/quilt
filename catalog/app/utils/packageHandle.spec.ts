import * as packageHandle from './packageHandle'

describe('utils/packageHandle', () => {
  describe('getValueName', () => {
    // eslint-disable-next-line no-template-curly-in-string
    expect(packageHandle.getValueName('${{ username }}')).toBe('username')
  })

  describe('convertItem', () => {
    it('should return static string when no template', () => {
      expect(packageHandle.convertItem('fgsfds')).toBe('fgsfds')
      expect(packageHandle.convertItem('')).toBe('')
    })

    it('should return template when template is broken', () => {
      expect(packageHandle.convertItem('start and ${{ no end')).toBe(
        'start and ${{ no end',
      )
    })

    it('should return converted when template has values', () => {
      expect(
        packageHandle.convertItem(
          // eslint-disable-next-line no-template-curly-in-string
          'what-${{ username }}-do/make-${{ directory }}-update',
          { directory: 'staging', username: 'fiskus' },
        ),
      ).toBe('what-fiskus-do/make-staging-update')
      expect(
        packageHandle.convertItem(
          // eslint-disable-next-line no-template-curly-in-string
          '${{ username }}/${{ directory }}',
          { directory: 'staging', username: 'fiskus' },
        ),
      ).toBe('fiskus/staging')
    })

    it('should return unconverted when no values ', () => {
      expect(
        packageHandle.convertItem(
          // eslint-disable-next-line no-template-curly-in-string
          'what-${{ username }}-do/make-${{ directory }}-update',
          { username: 'fiskus' },
        ),
        // eslint-disable-next-line no-template-curly-in-string
      ).toBe('what-fiskus-do/make-${{ directory }}-update')
      expect(
        packageHandle.convertItem(
          // eslint-disable-next-line no-template-curly-in-string
          '${{ username }}/${{ directory }}',
          { directory: 'staging' },
        ),
        // eslint-disable-next-line no-template-curly-in-string
      ).toBe('${{ username }}/staging')
    })
  })
})
