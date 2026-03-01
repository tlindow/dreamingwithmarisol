import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 't8kqnnav',
    dataset: 'production'
  },
  deployment: {
    appId: 'cx1qapdfmf1b92lai2qt1tgz',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
    appId: 'cx1qapdfmf1b92lai2qt1tgz',
  }
})
