import {Page} from '@core/Page'
import {createStore} from '@core/createStore'
import {rootReducer} from '@/redux/rootReducer'
import {Excel} from '@/components/excel/Excel'
import {Header} from '@/components/header/Header'
import {Toolbar} from '@/components/toolbar/Toolbar'
import {Formula} from '@/components/formula/Formula'
import {Table} from '@/components/table/Table'
import {normalizeInitilState} from '@/redux/initialState'
import {StateProcessor} from '@core/StateProcessor'
import {LocalStorageClient} from '@core/LocalStorageClient'

export class ExcelPage extends Page {
  constructor(param) {
    super(param)

    this.storeSub = null
    this.processor = new StateProcessor(
      new LocalStorageClient(this.params)
    )
  }

  async getRoot() {
    const state = await this.processor.get()
    const store = createStore(rootReducer, normalizeInitilState(state))

    this.storeSub = store.subscribe(this.processor.listen)

    this.excel = new Excel({
      components: [Header, Toolbar, Formula, Table],
      store
    })

    return this.excel.getRoot()
  }

  afterRender() {
    this.excel.init()
  }

  destroy() {
    this.excel.destroy()
    this.storeSub.unsubscribe()
  }
}
