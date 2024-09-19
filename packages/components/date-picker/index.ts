import { withNoopInstall } from '@element-plus/utils'
import DatePicker from './src/date-picker'
import BasicDateTable from './src/date-picker-com/basic-date-table.vue'
import BasicMonthTable from './src/date-picker-com/basic-month-table.vue'
import BasicYearTable from './src/date-picker-com/basic-year-table.vue'
import PanelDatePick from './src/date-picker-com/panel-date-pick.vue'
import PanelDateRange from './src/date-picker-com/panel-date-range.vue'
import type { SFCWithInstall } from '@element-plus/utils'
import type { App } from 'vue'

const _DatePicker = DatePicker as SFCWithInstall<typeof DatePicker>

_DatePicker.install = (app: App) => {
  app.component(_DatePicker.name, _DatePicker)
}

export default _DatePicker
export const ElDatePicker = _DatePicker
export * from './src/constants'
export * from './src/props/date-picker'
export type { DatePickerInstance } from './src/instance'
export const ElBasicDateTable = withNoopInstall(BasicDateTable)
export const ElBasicMonthTable = withNoopInstall(BasicMonthTable)
export const ElBasicYearTable = withNoopInstall(BasicYearTable)
export const ElPanelDateRange = withNoopInstall(PanelDateRange)
export const ElPanelDatePick = withNoopInstall(PanelDatePick)
