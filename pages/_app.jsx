import App, { Container } from "next/app"
import React from "react"
import CssBaseline from "@material-ui/core/CssBaseline"
import {
  createMuiTheme,
  MuiThemeProvider,
  createGenerateClassName
} from "@material-ui/core/styles"
import { SheetsRegistry } from "jss"
import JssProvider from "react-jss/lib/JssProvider"

import { theme } from "../util/styles"

import withReduxStore from "../store/with-redux-store"
import { Provider } from "react-redux"

function createPageContext() {
  return {
    theme: createMuiTheme(theme),
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateClassName: createGenerateClassName()
  }
}

const getPageContext = () => {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (!process.browser) {
    return createPageContext()
  }

  // Reuse context on the client-side.
  if (!global.__INIT_MATERIAL_UI__) {
    global.__INIT_MATERIAL_UI__ = createPageContext()
  }

  return global.__INIT_MATERIAL_UI__
}

class BROCApp extends App {
  static async getInitialProps({ Component, context }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(context)
    }

    return { pageProps }
  }

  constructor(props) {
    super(props)
    this.pageContext = getPageContext()
  }

  // pageContext = null

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side")
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props
    return (
      <Container>
        <JssProvider
          registry={this.pageContext.sheetsRegistry}
          generateClassName={this.pageContext.generateClassName}
        >
          <MuiThemeProvider
            theme={this.pageContext.theme}
            sheetsManager={this.pageContext.sheetsManager}
          >
            <CssBaseline />
            <Provider store={reduxStore}>
              <Component {...pageProps} />
            </Provider>
          </MuiThemeProvider>
        </JssProvider>
      </Container>
    )
  }
}

export default withReduxStore(BROCApp)
