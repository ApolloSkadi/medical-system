import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'tailwindcss/tailwind.css'
import './index.scss'
import { createRoot } from 'react-dom/client'
import { RouterProvider} from 'react-router-dom'
import routes from '@/router'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.locale('zh-cn');
// 继承插件
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.extend(customParseFormat)

createRoot(document.getElementById('root')).render(
    <RouterProvider router={routes}/>
)
