<?php
// geoip.inc
// Copyright (C) 2007 MaxMind LLC
// This library is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public
// License as published by the Free Software Foundation; either
// version 2.1 of the License, or (at your option) any later version.
// This library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.
// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307
// =====================================================================
//              Edited by NinTechNet (https://nintechnet.com/)
//                         Revision 2019-05-20
// =====================================================================
define('NFW_GEOIP_COUNTRY_BEGIN', 16776960);
define('NFW_GEOIP_STANDARD', 0);
define('NFW_STRUCTURE_INFO_MAX_SIZE', 20);
define('NFW_GEOIP_COUNTRY_EDITION', 1);
define('NFW_GEOIP_COUNTRY_EDITION_V6', 12);
define('NFW_STANDARD_RECORD_LENGTH', 3);
define('NFW_MAX_ORG_RECORD_LENGTH', 300);
define('NFW_SEGMENT_RECORD_LENGTH', 3);
define('NFW_GEOIP_ASNUM_EDITION', 9);
define('NFW_GEOIP_ASNUM_EDITION_V6', 21);

class nfw_GeoIP {
   public $flags;
	public $filehandle;
	public $databaseType;
	public $databaseSegments;
	public $record_length;
	var $GEOIP_COUNTRY_CODES = array(
	'','AP','EU','AD','AE','AF','AG','AI','AL','AM','CW','AO','AQ','AR','AS','AT','AU','AW','AZ','BA','BB','BD','BE','BF','BG','BH','BI','BJ','BM','BN','BO','BR','BS','BT','BV','BW','BY','BZ','CA','CC','CD','CF','CG','CH','CI','CK','CL','CM','CN','CO','CR','CU','CV','CX','CY','CZ','DE','DJ','DK','DM','DO','DZ','EC','EE','EG','EH','ER','ES','ET','FI','FJ','FK','FM','FO','FR','SX','GA','GB','GD','GE','GF','GH','GI','GL','GM','GN','GP','GQ','GR','GS','GT','GU','GW','GY','HK','HM','HN','HR','HT','HU','ID','IE','IL','IN','IO','IQ','IR','IS','IT','JM','JO','JP','KE','KG','KH','KI','KM','KN','KP','KR','KW','KY','KZ','LA','LB','LC','LI','LK','LR','LS','LT','LU','LV','LY','MA','MC','MD','MG','MH','MK','ML','MM','MN','MO','MP','MQ','MR','MS','MT','MU','MV','MW','MX','MY','MZ','NA','NC','NE','NF','NG','NI','NL','NO','NP','NR','NU','NZ','OM','PA','PE','PF','PG','PH','PK','PL','PM','PN','PR','PS','PT','PW','PY','QA','RE','RO','RU','RW','SA','SB','SC','SD','SE','SG','SH','SI','SJ','SK','SL','SM','SN','SO','SR','ST','SV','SY','SZ','TC','TD','TF','TG','TH','TJ','TK','TM','TN','TO','TL','TR','TT','TV','TW','TZ','UA','UG','UM','US','UY','UZ','VA','VC','VE','VG','VI','VN','VU','WF','WS','YE','YT','RS','ZA','ZM','ME','ZW','A1','A2','O1','AX','GG','IM','JE','BL','MF', 'BQ');
}

function nfw_setup_segments($gi){
	$gi->databaseType = NFW_GEOIP_COUNTRY_EDITION;
	$gi->record_length = NFW_STANDARD_RECORD_LENGTH;
	$filepos = ftell($gi->filehandle);
	fseek($gi->filehandle, -3, SEEK_END);
	for ($i = 0; $i < NFW_STRUCTURE_INFO_MAX_SIZE; $i++) {
		$delim = fread($gi->filehandle, 3);
		if ($delim == (chr(255) . chr(255) . chr(255)) ){
			$gi->databaseType = ord(fread($gi->filehandle, 1));
			if ($gi->databaseType >= 106) {
				$gi->databaseType -= 105;
			}
			if ($gi->databaseType == NFW_GEOIP_ASNUM_EDITION ||
				$gi->databaseType == NFW_GEOIP_ASNUM_EDITION_V6 ) {

				$gi->databaseSegments = 0;
				$buf = fread($gi->filehandle, NFW_SEGMENT_RECORD_LENGTH);
				for ($j = 0; $j < NFW_SEGMENT_RECORD_LENGTH; $j++) {
					$gi->databaseSegments += (ord($buf[$j]) << ($j * 8));
				}
			}
			break;
		} else {
			fseek($gi->filehandle, -4, SEEK_CUR);
		}
	}
	if ($gi->databaseType == NFW_GEOIP_COUNTRY_EDITION ||
		$gi->databaseType == NFW_GEOIP_COUNTRY_EDITION_V6) {

		$gi->databaseSegments = NFW_GEOIP_COUNTRY_BEGIN;
	}
	fseek($gi->filehandle, $filepos, SEEK_SET);
	return $gi;
}

function nfw_geoip_open($filename, $flags) {
	$gi = new nfw_GeoIP;
	$gi->flags = $flags;
	$gi->filehandle = fopen($filename, "rb") or die( "Can not open $filename\n" );
	$gi = nfw_setup_segments($gi);
	return $gi;
}

function nfw_geoip_close($gi) {
	return fclose($gi->filehandle);
}

function nfw_geoip_country_id_by_addr($gi, $addr) {
	$ipnum = ip2long($addr);
	return nfw_geoip_seek_country($gi, $ipnum) - NFW_GEOIP_COUNTRY_BEGIN;
}

function nfw_geoip_country_id_by_addr_v6($gi, $addr) {
	$ipnum = inet_pton($addr);
	return nfw_geoip_seek_country_v6($gi, $ipnum) - NFW_GEOIP_COUNTRY_BEGIN;
}

function nfw_geoip_country_code_by_addr($gi, $addr) {
	$country_id = nfw_geoip_country_id_by_addr($gi,$addr);
	if ($country_id !== false) {
		return $gi->GEOIP_COUNTRY_CODES[$country_id];
	}
	return false;
}

function nfw_geoip_country_code_by_addr_v6($gi, $addr) {
	$country_id = nfw_geoip_country_id_by_addr_v6($gi,$addr);
	if ($country_id !== false) {
		return $gi->GEOIP_COUNTRY_CODES[$country_id];
	}
	return false;
}

function nfw_geoip_seek_country_v6($gi, $ipnum) {
  # arrays from unpack start with offset 1
  # yet another php mystery. array_merge work around
  # this broken behaviour
  $v6vec = array_merge(unpack( "C16", $ipnum));

  $offset = 0;
  for ($depth = 127; $depth >= 0; --$depth) {
		fseek($gi->filehandle, 2 * $gi->record_length * $offset, SEEK_SET) == 0 or die("fseek failed");
		$buf = fread($gi->filehandle, 2 * $gi->record_length);
		$x = array(0,0);
		for ($i = 0; $i < 2; ++$i) {
			for ($j = 0; $j < $gi->record_length; ++$j) {
			$x[$i] += ord($buf[$gi->record_length * $i + $j]) << ($j * 8);
			}
		}
		$bnum = 127 - $depth;
		$idx = $bnum >> 3;
		$b_mask = 1 << ( $bnum & 7 ^ 7 );
		if (($v6vec[$idx] & $b_mask) > 0) {
			if ($x[1] >= $gi->databaseSegments) {
				return $x[1];
			}
			$offset = $x[1];
		} else {
			if ($x[0] >= $gi->databaseSegments) {
				return $x[0];
			}
			$offset = $x[0];
		}
	}
	trigger_error("error traversing database - perhaps it is corrupt?", E_USER_ERROR);
	return false;
}

function nfw_geoip_name_by_addr_v6($gi, $addr) {
	if ($addr == null) {
		return 0;
	}
	$ipnum = inet_pton($addr);
	return nfw_get_org_v6($gi, $ipnum);
}

function nfw_geoip_name_by_addr($gi, $addr) {
	if ($addr == null) {
		return 0;
	}
	$ipnum = ip2long($addr);
	return nfw_get_org($gi, $ipnum);
}

function nfw_common_get_org($gi, $seek_org) {
	$record_pointer = $seek_org + (2 * $gi->record_length - 1) * $gi->databaseSegments;
	fseek($gi->filehandle, $record_pointer, SEEK_SET);
	$org_buf = fread($gi->filehandle, NFW_MAX_ORG_RECORD_LENGTH);
	$org_buf = nfw_safe_substr($org_buf, 0, strpos($org_buf, "\0"));
	return $org_buf;
}

function nfw_get_org_v6($gi, $ipnum) {
	$seek_org = nfw_geoip_seek_country_v6($gi, $ipnum);
	if ($seek_org == $gi->databaseSegments) {
		return null;
	}
	return nfw_common_get_org($gi, $seek_org);
}

function nfw_get_org($gi, $ipnum) {
	$seek_org = nfw_geoip_seek_country($gi, $ipnum);
	if ($seek_org == $gi->databaseSegments) {
		return null;
	}
	return nfw_common_get_org($gi, $seek_org);
}

function nfw_geoip_seek_country($gi, $ipnum) {
	$offset = 0;
	for ($depth = 31; $depth >= 0; --$depth) {
		fseek($gi->filehandle, 2 * $gi->record_length * $offset, SEEK_SET) == 0 or die("fseek failed");
		$buf = fread($gi->filehandle, 2 * $gi->record_length);
		$x = array(0,0);
		for ($i = 0; $i < 2; ++$i) {
			for ($j = 0; $j < $gi->record_length; ++$j) {
			$x[$i] += ord($buf[$gi->record_length * $i + $j]) << ($j * 8);
			}
		}
		if ($ipnum & (1 << $depth)) {
			if ($x[1] >= $gi->databaseSegments) {
				return $x[1];
			}
			$offset = $x[1];
		} else {
			if ($x[0] >= $gi->databaseSegments) {
				return $x[0];
			}
			$offset = $x[0];
		}
	}
	trigger_error("error traversing database - perhaps it is corrupt?", E_USER_ERROR);
	return false;
}

function nfw_safe_substr($string, $start, $length) {
	// workaround php's broken substr, strpos, etc handling with
	// mbstring.func_overload and mbstring.internal_encoding
	$mbExists = extension_loaded('mbstring');
	if ($mbExists) {
		$enc = mb_internal_encoding();
		mb_internal_encoding('ISO-8859-1');
	}
	$buf = substr($string, $start, $length);
	if ($mbExists) {
		mb_internal_encoding($enc);
	}
	return $buf;
}
