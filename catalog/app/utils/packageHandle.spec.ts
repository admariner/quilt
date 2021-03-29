import * as packageHandle from './packageHandle'

describe('utils/packageHandle', () => {
  describe('getValueName', () => {
    it('should return value name', () => {
      // eslint-disable-next-line no-template-curly-in-string
      expect(packageHandle.getValueName('${{ username }}')).toBe('username')
    })

    it('should return null if no value found', () => {
      expect(packageHandle.getValueName('${{ username')).toBe(null)
    })
  })

  describe('convertItem', () => {
    it('should return static string when no template', () => {
      expect(packageHandle.convertItem('fgsfds')).toBe('fgsfds')
      expect(packageHandle.convertItem('')).toBe('')
    })

    it('should treat broken template as a string and return this string', () => {
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

    it('should return null when no values ', () => {
      expect(
        packageHandle.convertItem(
          // eslint-disable-next-line no-template-curly-in-string
          'what-${{ username }}-do/make-${{ directory }}-update',
          { username: 'fiskus' },
        ),
      ).toBe(null)
      expect(
        packageHandle.convertItem(
          // eslint-disable-next-line no-template-curly-in-string
          '${{ username }}/${{ directory }}',
          { directory: 'staging' },
        ),
      ).toBe(null)
      expect(
        packageHandle.convertItem(
          // eslint-disable-next-line no-template-curly-in-string
          '${{ username }}/${{ directory }}',
          { directory: undefined, username: undefined },
        ),
      ).toBe(null)
    })
  })

  describe('convert', () => {
    it('should use first successful replacement', () => {
      expect(
        // eslint-disable-next-line no-template-curly-in-string
        packageHandle.convert(['${{ username }}/${{ directory }}', 'abc/def'], {
          username: 'fiskus',
        }),
      ).toBe('abc/def')
      expect(
        packageHandle.convert(
          // eslint-disable-next-line no-template-curly-in-string
          ['${{ a }}/${{ b }}', '${{ username }}/${{ directory }}', 'abc/def'],
          {
            username: 'fiskus',
            directory: 'staging',
          },
        ),
      ).toBe('fiskus/staging')
      expect(
        packageHandle.convert(
          // eslint-disable-next-line no-template-curly-in-string
          ['${{ username }}/${{ directory }}', '${{ username }}/', 'abc/def'],
          {
            username: 'fiskus',
          },
        ),
      ).toBe('fiskus/')
    })
  })
})
