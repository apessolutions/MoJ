import { Helmet } from 'react-helmet-async';
import { TranscriptDemo } from 'src/components/transcript';
import { CONFIG } from 'src/config-global';

export default function TranscriptDemoPage() {
  return (
    <>
      <Helmet>
        <title>{`Transcript Demo - ${CONFIG.site.name}`}</title>
      </Helmet>

      <TranscriptDemo />
    </>
  );
}
