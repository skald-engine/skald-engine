describe('sk/utils/colors.js', () => {
  let colors = require('./colors.js')

  describe('[conversors]', () => {
    describe('.hexToColor', () => {
      it('should convert the color', () => {
        assert.equal(colors.hexToColor('#F1D3E6'), 0xF1D3E6)
        assert.equal(colors.hexToColor('#ffffff'), 0xFFFFFF)
        assert.equal(colors.hexToColor('#000000'), 0x000000)
      })

      it('should throw error if invalid', () => {
        assert.throws(()=>{colors.hexToColor(3)}, TypeError)
        assert.throws(()=>{colors.hexToColor('=)')}, TypeError)
        assert.throws(()=>{colors.hexToColor('#FFF')}, TypeError)
      })
    })


    describe('.rgbToColor', () => {
      it('should convert the color', () => {
        assert.equal(colors.rgbToColor(241, 211, 230), 0xF1D3E6)
        assert.equal(colors.rgbToColor(255, 255, 255), 0xFFFFFF)
        assert.equal(colors.rgbToColor(0, 0, 0), 0x000000)
      })

      it('should throw error if invalid', () => {
        assert.throws(()=>{colors.rgbToColor(3)}, TypeError)
        assert.throws(()=>{colors.rgbToColor(-1, 0, 0)}, TypeError)
        assert.throws(()=>{colors.rgbToColor(0, '0', 0)}, TypeError)
      })
    })


    describe('.hslToColor', () => {
      it('should convert the color', () => {
        assert.equal(colors.hslToColor(360, .1, .9), 0xE8E3E3)
        assert.equal(colors.hslToColor(350, .84, .1), 0x2F040B)
        assert.equal(colors.hslToColor(128, 0, 1), 0xFFFFFF)
        assert.equal(colors.hslToColor(128, 1, 0), 0x000000)
        assert.equal(colors.hslToColor(128, .7, .75), 0x93EC9F)
        assert.equal(colors.hslToColor(35, .5, .5), 0xBF8A40)
        assert.equal(colors.hslToColor(0, .2, .7), 0xC2A3A3)
      })

      it('should throw error if invalid', () => {
        assert.throws(()=>{colors.hslToColor(3)}, TypeError)
        assert.throws(()=>{colors.hslToColor(365, 0, 0)}, TypeError)
        assert.throws(()=>{colors.hslToColor(15, 2, 0)}, TypeError)
        assert.throws(()=>{colors.hslToColor(15, 1, -3)}, TypeError)
      })
    })


    describe('.colorToHex', () => {
      it('should convert the color', () => {
        assert.equal(colors.colorToHex(0xF1D3E6), '#F1D3E6')
        assert.equal(colors.colorToHex(0xFFFFFF), '#FFFFFF')
        assert.equal(colors.colorToHex(0x000000), '#000000')
      })

      it('should throw error if invalid', () => {
        assert.throws(()=>{colors.colorToHex(99999999)}, TypeError)
        assert.throws(()=>{colors.colorToHex(-156)}, TypeError)
        assert.throws(()=>{colors.colorToHex('=)')}, TypeError)
        assert.throws(()=>{colors.colorToHex('#FFF')}, TypeError)
      })
    })


    describe('.colorToRgb', () => {
      it('should convert the color', () => {
        assert.deepEqual(colors.colorToRgb(0xF1D3E6), {red:241, green:211, blue:230})
        assert.deepEqual(colors.colorToRgb(0xFFFFFF), {red:255, green:255, blue:255})
        assert.deepEqual(colors.colorToRgb(0x000000), {red:0, green:0, blue:0})
      })

      it('should throw error if invalid', () => {
        assert.throws(()=>{colors.colorToRgb(99999999)}, TypeError)
        assert.throws(()=>{colors.colorToRgb(-156)}, TypeError)
        assert.throws(()=>{colors.colorToRgb('=)')}, TypeError)
        assert.throws(()=>{colors.colorToRgb('#FFF')}, TypeError)
      })
    })


    describe('.colorToHsl', () => {
      it('should convert the color', () => {
        let equal = (r, e) => {
          assert.equal(r.hue, e.hue, `Using ${JSON.stringify(e)}`)
          assert.closeTo(r.saturation, e.saturation, 0.01, `Using ${JSON.stringify(e)}`)
          assert.closeTo(r.lightness, e.lightness, 0.01, `Using ${JSON.stringify(e)}`)
        }

        equal(colors.colorToHsl(0xE8E3E3), {hue:0, saturation:.1, lightness:.9})
        equal(colors.colorToHsl(0x2F040B), {hue:350, saturation:.84, lightness:.1})
        equal(colors.colorToHsl(0xFFFFFF), {hue:0, saturation:0, lightness:1})
        equal(colors.colorToHsl(0x000000), {hue:0, saturation:0, lightness:0})
        equal(colors.colorToHsl(0x93EC9F), {hue:128, saturation:.7, lightness:.75})
        equal(colors.colorToHsl(0xBF8A40), {hue:35, saturation:.5, lightness:.5})
        equal(colors.colorToHsl(0xC2A3A3), {hue:0, saturation:.2, lightness:.7})
      })

      it('should throw error if invalid', () => {
        assert.throws(()=>{colors.colorToRgb(99999999)}, TypeError)
        assert.throws(()=>{colors.colorToRgb(-156)}, TypeError)
        assert.throws(()=>{colors.colorToRgb('=)')}, TypeError)
        assert.throws(()=>{colors.colorToRgb('#FFF')}, TypeError)
      })
    })
  })

  describe('[channels]', () => {
    describe('.red', () => {
      it('should convert the color', () => {
        assert.equal(colors.red(0xF1D3E6), 241)
        assert.equal(colors.red(0x685025), 104)
        assert.equal(colors.red(0xFFFFFF), 255)
        assert.equal(colors.red(0x000000), 0)
      })

      it('should throw error if invalid', () => {
        assert.throws(()=>{colors.red(99999999)}, TypeError)
        assert.throws(()=>{colors.red(-156)}, TypeError)
        assert.throws(()=>{colors.red('=)')}, TypeError)
        assert.throws(()=>{colors.red('#FFF')}, TypeError)
      })
    })


    describe('.green', () => {
      it('should convert the color', () => {
        assert.equal(colors.green(0xF1D3E6), 211)
        assert.equal(colors.green(0x685025), 80)
        assert.equal(colors.green(0xFFFFFF), 255)
        assert.equal(colors.green(0x000000), 0)
      })

      it('should throw error if invalid', () => {
        assert.throws(()=>{colors.green(99999999)}, TypeError)
        assert.throws(()=>{colors.green(-156)}, TypeError)
        assert.throws(()=>{colors.green('=)')}, TypeError)
        assert.throws(()=>{colors.green('#FFF')}, TypeError)
      })
    })


    describe('.blue', () => {
      it('should convert the color', () => {
        assert.equal(colors.blue(0xF1D3E6), 230)
        assert.equal(colors.blue(0x685025), 37)
        assert.equal(colors.blue(0xFFFFFF), 255)
        assert.equal(colors.blue(0x000000), 0)
      })

      it('should throw error if invalid', () => {
        assert.throws(()=>{colors.blue(99999999)}, TypeError)
        assert.throws(()=>{colors.blue(-156)}, TypeError)
        assert.throws(()=>{colors.blue('=)')}, TypeError)
        assert.throws(()=>{colors.blue('#FFF')}, TypeError)
      })
    })


    describe('.hue', () => {
      it('should convert the color', () => {
        assert.equal(colors.hue(0xF1D3E6), 322)
        assert.equal(colors.hue(0x685025), 39)
        assert.equal(colors.hue(0xFFFFFF), 0)
        assert.equal(colors.hue(0x000000), 0)
      })

      it('should throw error if invalid', () => {
        assert.throws(()=>{colors.hue(99999999)}, TypeError)
        assert.throws(()=>{colors.hue(-156)}, TypeError)
        assert.throws(()=>{colors.hue('=)')}, TypeError)
        assert.throws(()=>{colors.hue('#FFF')}, TypeError)
      })
    })


    describe('.saturation', () => {
      it('should convert the color', () => {
        assert.closeTo(colors.saturation(0xF1D3E6), .52, 0.01)
        assert.closeTo(colors.saturation(0x685025), .48, 0.01)
        assert.closeTo(colors.saturation(0xFFFFFF), 0, 0.01)
        assert.closeTo(colors.saturation(0x000000), 0, 0.01)
      })

      it('should throw error if invalid', () => {
        assert.throws(()=>{colors.saturation(99999999)}, TypeError)
        assert.throws(()=>{colors.saturation(-156)}, TypeError)
        assert.throws(()=>{colors.saturation('=)')}, TypeError)
        assert.throws(()=>{colors.saturation('#FFF')}, TypeError)
      })
    })


    describe('.lightness', () => {
      it('should convert the color', () => {
        assert.closeTo(colors.lightness(0xF1D3E6), .89, 0.01)
        assert.closeTo(colors.lightness(0x685025), .28, 0.01)
        assert.closeTo(colors.lightness(0xFFFFFF), 1, 0.01)
        assert.closeTo(colors.lightness(0x000000), 0, 0.01)
      })

      it('should throw error if invalid', () => {
        assert.throws(()=>{colors.lightness(99999999)}, TypeError)
        assert.throws(()=>{colors.lightness(-156)}, TypeError)
        assert.throws(()=>{colors.lightness('=)')}, TypeError)
        assert.throws(()=>{colors.lightness('#FFF')}, TypeError)
      })
    })
  })

})
