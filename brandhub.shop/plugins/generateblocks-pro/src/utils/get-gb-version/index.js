import { coerce, clean } from 'semver';

export default function getGBVersion() {
	return coerce( clean( generateBlocksPro.generateblocksVersion ) )?.version;
}
