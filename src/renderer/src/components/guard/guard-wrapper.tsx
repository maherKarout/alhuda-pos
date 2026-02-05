import { useAppSelector } from '@renderer/hooks/useAppSelector'
import React from 'react'
import { AccountRole } from '@renderer/consts'

function GuardWrapper({
  children,
  roles,
  returnSpace
}: {
  children: React.ReactNode
  roles: AccountRole[]
  returnSpace?: boolean
}) {
  const account = useAppSelector((state) => state.auth.account)
  const role = account?.accountRole
  if (!roles?.includes(role as AccountRole)) {
    return returnSpace ? <span></span> : null
  }
  return <div>{children}</div>
}

export default GuardWrapper
