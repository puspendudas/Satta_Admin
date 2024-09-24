import { Helmet } from 'react-helmet-async';

import { WinningReportView } from 'src/sections/winning-report/view';

// ----------------------------------------------------------------------

export default function WinningReportPage() {
  return (
    <>
      <Helmet>
        <title> Winning Report | {import.meta.env.VITE_PRODUCT_NAME} Admin </title>
      </Helmet>

      <WinningReportView />
    </>
  );
}
