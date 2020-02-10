const disabled1 = 'rgba(255, 255, 255, 0.5)';

export const theme = {
  Violet: {
    DARK_THEME: {
      palette: {
        action: {
          active: '#fff',
          hover: '#1B2337',
          disabled: disabled1
        },
        background: {
          paper: 'rgba(59, 69, 95, 1)',
          default: '#23304f',
          main: '#02bad1',
          secondary: 'rgba(255, 255, 255, 0.08)'
        },
        common: {
          black: '#000',
          white: '#fff'
        },
        table: {
          hover: '#1b2337',
          selected: '#1b2337',
          borderBottomColor: '#474F64',
          headerTextColor: '#FFFFFF',
          headerActiveColor: '#448DC2'
        },
        navbar: {
          hover: '#fff'
        },
        button: {
          hover: 'rgba(255,255,255,1)',
          disabled: disabled1
        },
        header: {
          headericoncolor: '#02bad1'
        },
        scrollBar: {
          scrollBar: 'rgba(0, 0, 0, 0.8)',
          thumb: 'rgba(102, 102, 102, 0.3)',
          scrollBarHover: 'rgba(6, 14, 27, 1)',
          thumbHover: 'rgba(102, 102, 102, 1)'
        },
        divider: '#5f5f5f',
        primary: {
          light: '#464d67',
          main: '#ffa517',
          dark: '#02bad1',
          contrastText: '#fff'
        },
        secondary: {
          light: '#464d67',
          main: '#448DC2',
          dark: '#006091',
          contrastText: '#fff'
        },
        text: {
          disabled: disabled1,
          hint: '#b3b3b3',
          primary: '#fff',
          secondary: '#ffa517'
        },
        messageCenter: {
          info: '#2abba0',
          warning: '#ef953e',
          success: '#50b843',
          error: '#ff5650'
        }
      }
    },
    LIGHT_THEME: {
      palette: {
        action: {
          active: '#77838D',
          hover: '#E3EBF4'
        },
        background: {
          paper: '#efefef',
          default: '#d7dde4'
        },
        common: {
          black: '#000',
          white: '#fff'
        },
        table: {
          hover: '#E3EBF4',
          selected: '#EBF1F8',
          borderBottomColor: '#E8EAED',
          headerTextColor: '#3B4C5C',
          headerActiveColor: '#448DC2'
        },
        navbar: {
          hover: '#849AAF'
        },
        button: {
          hover: 'rgba(128,128,128,0.7)'
        },
        primary: {
          light: 'rgba(107, 119, 131, .3)',
          main: '#3B4C5C',
          dark: '#b3b3b3',
          contrastText: '#fff'
        },
        secondary: {
          main: '#515b7d',
          light: '#464d67',
          dark: '#006091',
          contrastText: '#fff'
        },
        text: {
          disabled: '#c5c8c7',
          hint: '#b3b3b3',
          primary: '#3B4C5C',
          secondary: '#77838D'
        },
        isc: {
          hoverBackground: 'rgba(0, 0, 0, 0.1)',
          selectBackground: 'rgba(0, 0, 0, 0.2)'
        },
        scrollBar: {
          scrollBar: '#D7DDE4',
          thumb: '#b2b2b2',
          scrollBarHover: '#dddddd',
          thumbHover: '#b2b2b2'
        },
        messageCenter: {
          info: '#58b9dd',
          warning: '#ffb369',
          success: '#7ed674',
          error: '#ff6d68'
        }
      }
    }
  },
  Cyan: {
    DARK_THEME: {
      palette: {
        action: {
          active: '#8EADBE',
          hover: '#2A3944',
          disabled: 'rgba(142, 173, 190, 0.3)'
        },
        background: {
          paper: '#202930',
          default: '#25303a'
        },
        common: {
          black: '#000',
          white: '#fff',
          hover: '#fff'
        },
        table: {
          hover: '#2A3944',
          selected: '#2F414F',
          borderBottomColor: '#37444A',
          headerTextColor: '#FFFFFF',
          headerActiveColor: '#448DC2'
        },
        navbar: {
          hover: '#fff'
        },
        button: {
          disabled: 'rgba(142, 173, 190, 0.3)',
          hover: 'rgba(255,255,255,1)'
        },
        header: {
          headericoncolor: '#02bad1'
        },
        scrollBar: {
          scrollBar: 'rgba(0, 0, 0, 0.8)',
          thumb: 'rgba(102, 102, 102, 0.3)',
          scrollBarHover: 'rgba(6, 14, 27, 1)',
          thumbHover: 'rgba(102, 102, 102, 1)'
        },
        divider: '#5f5f5f',
        dialogColor: '#03acb4',
        headericoncolor: '#02bad1',
        stepperInactive: '#a1a1a1',
        countcolor: '#fff',
        primary: {
          light: '#1A1F22',
          main: '#8EADBE',
          dark: '#8EADBE',
          contrastText: '#fff'
        },
        secondary: {
          main: '#02BAD1',
          contrastText: '#fff'
        },
        text: {
          disabled: 'rgba(142, 173, 190, 0.3)',
          hint: '#b3b3b3',
          primary: '#fff',
          secondary: '#8EADBE'
        },
        messageCenter: {
          info: '#2abba0',
          warning: '#ef953e',
          success: '#50b843',
          error: '#ff5650'
        }
      }
    },
    LIGHT_THEME: {
      palette: {
        action: {
          active: '#77838D',
          hover: '#E3EBF4'
        },
        background: {
          paper: '#efefef',
          default: '#d7dde4'
        },
        common: {
          black: '#000',
          white: '#fff'
        },
        table: {
          hover: '#E3EBF4',
          selected: '#EBF1F8',
          borderBottomColor: '#E8EAED',
          headerTextColor: '#3B4C5C',
          headerActiveColor: '#448DC2'
        },
        navbar: {
          hover: '#849AAF'
        },
        button: {
          hover: 'rgba(128,128,128,0.7)'
        },
        dialogColor: '#D7DDE4',
        headericoncolor: '#02BAD1',
        stepperInactive: '#a1a1a1',
        countcolor: '#666666',
        primary: {
          light: '#D7DDE4',
          main: '#77838D',
          dark: '#77838D',
          contrastText: '#fff'
        },
        secondary: {
          main: '#02BAD1',
          contrastText: '#fff'
        },
        text: {
          disabled: '#c5c8c7',
          hint: '#b3b3b3',
          primary: '#3B4C5C',
          secondary: '#77838D'
        },
        isc: {
          hoverBackground: 'rgba(0, 0, 0, 0.1)',
          selectBackground: 'rgba(0, 0, 0, 0.2)'
        },
        scrollBar: {
          scrollBar: '#D7DDE4',
          thumb: '#b2b2b2',
          scrollBarHover: '#dddddd',
          thumbHover: '#b2b2b2'
        },
        messageCenter: {
          info: '#58b9dd',
          warning: '#ffb369',
          success: '#7ed674',
          error: '#ff6d68'
        }
      }
    }
  },
  Red: {
    DARK_THEME: {
      palette: {
        action: {
          active: '#8EADBE',
          hover: '#2A3944'
        },
        background: {
          paper: '#202930',
          default: '#25303a'
        },
        common: {
          black: '#000',
          white: '#fff',
          hover: '#fff'
        },
        table: {
          hover: '#2A3944',
          selected: '#2F414F',
          borderBottomColor: '#37444A',
          headerTextColor: '#FFFFFF',
          headerActiveColor: '#448DC2'
        },
        navbar: {
          hover: '#fff'
        },
        button: {
          hover: 'rgba(255,255,255,1)'
        },
        header: {
          headericoncolor: '#02bad1'
        },
        scrollBar: {
          scrollBar: 'rgba(0, 0, 0, 0.8)',
          thumb: 'rgba(102, 102, 102, 0.3)',
          scrollBarHover: 'rgba(6, 14, 27, 1)',
          thumbHover: 'rgba(102, 102, 102, 1)'
        },
        divider: '#5f5f5f',
        dialogColor: '#03acb4',
        headericoncolor: '#ed1a3d',
        stepperInactive: '#a1a1a1',
        countcolor: '#fff',
        primary: {
          light: '#1A1F22',
          main: '#8EADBE',
          dark: '#8EADBE',
          contrastText: '#fff'
        },
        secondary: {
          main: '#ed1a3d',
          contrastText: '#fff'
        },
        text: {
          disabled: 'rgba(142, 173, 190, 0.3)',
          hint: '#b3b3b3',
          primary: '#fff',
          secondary: '#8EADBE'
        },
        messageCenter: {
          info: '#2abba0',
          warning: '#ef953e',
          success: '#50b843',
          error: '#ff5650'
        }
      }
    },
    LIGHT_THEME: {
      palette: {
        action: {
          active: '#77838D',
          hover: '#E3EBF4'
        },
        background: {
          paper: '#efefef',
          default: '#d7dde4'
        },
        common: {
          black: '#000',
          white: '#fff'
        },
        table: {
          hover: '#E3EBF4',
          selected: '#EBF1F8',
          borderBottomColor: '#E8EAED',
          headerTextColor: '#3B4C5C',
          headerActiveColor: '#448DC2'
        },
        navbar: {
          hover: '#849AAF'
        },
        button: {
          hover: 'rgba(128,128,128,0.7)'
        },
        dialogColor: '#D7DDE4',
        headericoncolor: '#ed1a3d',
        stepperInactive: '#a1a1a1',
        countcolor: '#666666',
        primary: {
          light: '#D7DDE4',
          main: '#77838D',
          dark: '#77838D',
          contrastText: '#fff'
        },
        secondary: {
          main: '#ed1a3d',
          contrastText: '#fff'
        },
        text: {
          disabled: '#c5c8c7',
          hint: '#b3b3b3',
          primary: '#3B4C5C',
          secondary: '#77838D'
        },
        isc: {
          hoverBackground: 'rgba(0, 0, 0, 0.1)',
          selectBackground: 'rgba(0, 0, 0, 0.2)'
        },
        scrollBar: {
          scrollBar: '#D7DDE4',
          thumb: '#b2b2b2',
          scrollBarHover: '#dddddd',
          thumbHover: '#b2b2b2'
        },
        messageCenter: {
          info: '#58b9dd',
          warning: '#ffb369',
          success: '#7ed674',
          error: '#ff6d68'
        }
      }
    }
  },
  Blue: {
    DARK_THEME: {
      palette: {
        action: {
          active: '#fff',
          hover: '#1B2337'
        },
        background: {
          paper: '#2A3249',
          default: '#25303a'
        },
        common: {
          black: '#000',
          white: '#fff'
        },
        table: {
          hover: '#1B2337',
          selected: '#222A3F',
          borderBottomColor: '#474F64',
          headerTextColor: '#FFFFFF',
          headerActiveColor: '#448DC2'
        },
        navbar: {
          hover: '#fff'
        },
        button: {
          hover: 'rgba(255,255,255,1)'
        },
        header: {
          headericoncolor: '#02bad1'
        },
        scrollBar: {
          scrollBar: 'rgba(0, 0, 0, 0.8)',
          thumb: 'rgba(102, 102, 102, 0.3)',
          scrollBarHover: 'rgba(6, 14, 27, 1)',
          thumbHover: 'rgba(102, 102, 102, 1)'
        },
        divider: '#5f5f5f',
        dialogColor: '#03acb4',
        headericoncolor: '#448DC2',
        countcolor: '#fff',
        stepperInactive: '#a1a1a1',
        primary: {
          light: '#464d67',
          main: '#C7C7C7',
          dark: '#C7C7C7',
          contrastText: '#fff'
        },
        secondary: {
          light: '#464d67',
          main: '#448DC2',
          dark: '#006091',
          contrastText: '#fff'
        },
        text: {
          disabled: 'rgba(0, 0, 0, 0.3)',
          hint: '#b3b3b3',
          primary: '#fff',
          secondary: '#C7C7C7'
        },
        messageCenter: {
          info: '#2abba0',
          warning: '#ef953e',
          success: '#50b843',
          error: '#ff5650'
        }
      }
    },
    LIGHT_THEME: {
      palette: {
        action: {
          active: '#77838D',
          hover: '#E3EBF4'
        },
        background: {
          paper: '#efefef',
          default: '#d7dde4'
        },
        common: {
          black: '#000',
          white: '#fff'
        },
        table: {
          hover: '#E3EBF4',
          selected: '#EBF1F8',
          borderBottomColor: '#E8EAED',
          headerTextColor: '#3B4C5C',
          headerActiveColor: '#448DC2'
        },
        navbar: {
          hover: '#849AAF'
        },
        button: {
          hover: 'rgba(128,128,128,0.7)'
        },
        dialogColor: '#03acb4',
        headericoncolor: '#4F5F6F',
        countcolor: '#666666',
        stepperInactive: '#a1a1a1',
        primary: {
          light: '#d7dde4',
          main: '#77838D',
          dark: '#77838D',
          contrastText: '#000000'
        },
        secondary: {
          light: '#7abdf5',
          main: '#448dc2',
          dark: '#006091',
          contrastText: '#000000'
        },
        text: {
          disabled: '#c5c8c7',
          hint: '#b3b3b3',
          primary: '#3B4C5C',
          secondary: '#77838D'
        },
        isc: {
          hoverBackground: 'rgba(0, 0, 0, 0.1)',
          selectBackground: 'rgba(0, 0, 0, 0.2)'
        },
        scrollBar: {
          scrollBar: '#D7DDE4',
          thumb: '#b2b2b2',
          scrollBarHover: '#dddddd',
          thumbHover: '#b2b2b2'
        },
        messageCenter: {
          info: '#58b9dd',
          warning: '#ffb369',
          success: '#7ed674',
          error: '#ff6d68'
        }
      }
    }
  }
};

export default theme;
