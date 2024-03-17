type ReportComponentProps =
  | {
    uri: string
    cid: string
  }
  | {
    did: string
  }
export const Component = (content: ReportComponentProps): JSX.Element => {
  return (
    <div>Report</div>
  )
}
