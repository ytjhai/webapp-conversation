import type { FC } from 'react'
import React from 'react'
import { Bars3Icon } from '@heroicons/react/24/solid'

export type IHeaderProps = {
  isMobile?: boolean
  onShowSideBar?: () => void
}

const Header: FC<IHeaderProps> = ({
  isMobile,
  onShowSideBar,
}) => {
  return (
    <div className="shrink-0 flex items-center justify-between h-12 px-3 bg-gray-100">
      {isMobile && (
        <div
          className='flex items-center justify-center h-8 w-8 cursor-pointer'
          onClick={() => onShowSideBar?.()}
        >
          <Bars3Icon className="h-4 w-4 text-gray-500" />
        </div>
      )}
    </div>
  )
}

export default React.memo(Header)
