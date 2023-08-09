import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import * as icons from "@mui/icons-material";
import axios from 'axios';

export const usStates = [
  { name: 'Alabama', code: 'AL' },
  { name: 'Alaska', code: 'AK' },
  { name: 'Arizona', code: 'AZ' },
  { name: 'Arkansas', code: 'AR' },
  { name: 'California', code: 'CA' },
  { name: 'Colorado', code: 'CO' },
  { name: 'Connecticut', code: 'CT' },
  { name: 'Delaware', code: 'DE' },
  { name: 'Florida', code: 'FL' },
  { name: 'Georgia', code: 'GA' },
  { name: 'Hawaii', code: 'HI' },
  { name: 'Idaho', code: 'ID' },
  { name: 'Illinois', code: 'IL' },
  { name: 'Indiana', code: 'IN' },
  { name: 'Iowa', code: 'IA' },
  { name: 'Kansas', code: 'KS' },
  { name: 'Kentucky', code: 'KY' },
  { name: 'Louisiana', code: 'LA' },
  { name: 'Maine', code: 'ME' },
  { name: 'Maryland', code: 'MD' },
  { name: 'Massachusetts', code: 'MA' },
  { name: 'Michigan', code: 'MI' },
  { name: 'Minnesota', code: 'MN' },
  { name: 'Mississippi', code: 'MS' },
  { name: 'Missouri', code: 'MO' },
  { name: 'Montana', code: 'MT' },
  { name: 'Nebraska', code: 'NE' },
  { name: 'Nevada', code: 'NV' },
  { name: 'New Hampshire', code: 'NH' },
  { name: 'New Jersey', code: 'NJ' },
  { name: 'New Mexico', code: 'NM' },
  { name: 'New York', code: 'NY' },
  { name: 'North Carolina', code: 'NC' },
  { name: 'North Dakota', code: 'ND' },
  { name: 'Ohio', code: 'OH' },
  { name: 'Oklahoma', code: 'OK' },
  { name: 'Oregon', code: 'OR' },
  { name: 'Pennsylvania', code: 'PA' },
  { name: 'Rhode Island', code: 'RI' },
  { name: 'South Carolina', code: 'SC' },
  { name: 'South Dakota', code: 'SD' },
  { name: 'Tennessee', code: 'TN' },
  { name: 'Texas', code: 'TX' },
  { name: 'Utah', code: 'UT' },
  { name: 'Vermont', code: 'VT' },
  { name: 'Virginia', code: 'VA' },
  { name: 'Washington', code: 'WA' },
  { name: 'West Virginia', code: 'WV' },
  { name: 'Wisconsin', code: 'WI' },
  { name: 'Wyoming', code: 'WY' },
];

export const countries = [
  { country: 'Afghanistan', code: 'AF' },
  { country: 'Albania', code: 'AL' },
  { country: 'Algeria', code: 'DZ' },
  { country: 'Andorra', code: 'AD' },
  { country: 'Angola', code: 'AO' },
  { country: 'Antigua and Barbuda', code: 'AG' },
  { country: 'Argentina', code: 'AR' },
  { country: 'Armenia', code: 'AM' },
  { country: 'Australia', code: 'AU' },
  { country: 'Austria', code: 'AT' },
  { country: 'Azerbaijan', code: 'AZ' },
  { country: 'Bahamas', code: 'BS' },
  { country: 'Bahrain', code: 'BH' },
  { country: 'Bangladesh', code: 'BD' },
  { country: 'Barbados', code: 'BB' },
  { country: 'Belarus', code: 'BY' },
  { country: 'Belgium', code: 'BE' },
  { country: 'Belize', code: 'BZ' },
  { country: 'Benin', code: 'BJ' },
  { country: 'Bhutan', code: 'BT' },
  { country: 'Bolivia', code: 'BO' },
  { country: 'Bosnia and Herzegovina', code: 'BA' },
  { country: 'Botswana', code: 'BW' },
  { country: 'Brazil', code: 'BR' },
  { country: 'Brunei', code: 'BN' },
  { country: 'Bulgaria', code: 'BG' },
  { country: 'Burkina Faso', code: 'BF' },
  { country: 'Burundi', code: 'BI' },
  { country: 'Cabo Verde', code: 'CV' },
  { country: 'Cambodia', code: 'KH' },
  { country: 'Cameroon', code: 'CM' },
  { country: 'Canada', code: 'CA' },
  { country: 'Central African Republic', code: 'CF' },
  { country: 'Chad', code: 'TD' },
  { country: 'Chile', code: 'CL' },
  { country: 'China', code: 'CN' },
  { country: 'Colombia', code: 'CO' },
  { country: 'Comoros', code: 'KM' },
  { country: 'Congo (Brazzaville)', code: 'CG' },
  { country: 'Congo (Kinshasa)', code: 'CD' },
  { country: 'Costa Rica', code: 'CR' },
  { country: 'Croatia', code: 'HR' },
  { country: 'Cuba', code: 'CU' },
  { country: 'Cyprus', code: 'CY' },
  { country: 'Czech Republic', code: 'CZ' },
  { country: 'Denmark', code: 'DK' },
  { country: 'Djibouti', code: 'DJ' },
  { country: 'Dominica', code: 'DM' },
  { country: 'Dominican Republic', code: 'DO' },
  { country: 'Ecuador', code: 'EC' },
  { country: 'Egypt', code: 'EG' },
  { country: 'El Salvador', code: 'SV' },
  { country: 'Equatorial Guinea', code: 'GQ' },
  { country: 'Eritrea', code: 'ER' },
  { country: 'Estonia', code: 'EE' },
  { country: 'Ethiopia', code: 'ET' },
  { country: 'Fiji', code: 'FJ' },
  { country: 'Finland', code: 'FI' },
  { country: 'France', code: 'FR' },
  { country: 'Gabon', code: 'GA' },
  { country: 'Gambia', code: 'GM' },
  { country: 'Georgia', code: 'GE' },
  { country: 'Germany', code: 'DE' },
  { country: 'Ghana', code: 'GH' },
  { country: 'Greece', code: 'GR' },
  { country: 'Grenada', code: 'GD' },
  { country: 'Guatemala', code: 'GT' },
  { country: 'Guinea', code: 'GN' },
  { country: 'Guinea-Bissau', code: 'GW' },
  { country: 'Guyana', code: 'GY' },
  { country: 'Haiti', code: 'HT' },
  { country: 'Holy See', code: 'VA' },
  { country: 'Honduras', code: 'HN' },
  { country: 'Hungary', code: 'HU' },
  { country: 'Iceland', code: 'IS' },
  { country: 'India', code: 'IN' },
  { country: 'Indonesia', code: 'ID' },
  { country: 'Iran', code: 'IR' },
  { country: 'Iraq', code: 'IQ' },
  { country: 'Ireland', code: 'IE' },
  { country: 'Israel', code: 'IL' },
  { country: 'Italy', code: 'IT' },
  { country: 'Jamaica', code: 'JM' },
  { country: 'Japan', code: 'JP' },
  { country: 'Jordan', code: 'JO' },
  { country: 'Kazakhstan', code: 'KZ' },
  { country: 'Kenya', code: 'KE' },
  { country: 'Kiribati', code: 'KI' },
  { country: 'Korea, North', code: 'KP' },
  { country: 'Korea, South', code: 'KR' },
  { country: 'Kosovo', code: 'XK' },
  { country: 'Kuwait', code: 'KW' },
  { country: 'Kyrgyzstan', code: 'KG' },
  { country: 'Laos', code: 'LA' },
  { country: 'Latvia', code: 'LV' },
  { country: 'Lebanon', code: 'LB' },
  { country: 'Lesotho', code: 'LS' },
  { country: 'Liberia', code: 'LR' },
  { country: 'Libya', code: 'LY' },
  { country: 'Liechtenstein', code: 'LI' },
  { country: 'Lithuania', code: 'LT' },
  { country: 'Luxembourg', code: 'LU' },
  { country: 'Madagascar', code: 'MG' },
  { country: 'Malawi', code: 'MW' },
  { country: 'Malaysia', code: 'MY' },
  { country: 'Maldives', code: 'MV' },
  { country: 'Mali', code: 'ML' },
  { country: 'Malta', code: 'MT' },
  { country: 'Marshall Islands', code: 'MH' },
  { country: 'Mauritania', code: 'MR' },
  { country: 'Mauritius', code: 'MU' },
  { country: 'Mexico', code: 'MX' },
  { country: 'Micronesia', code: 'FM' },
  { country: 'Moldova', code: 'MD' },
  { country: 'Monaco', code: 'MC' },
  { country: 'Mongolia', code: 'MN' },
  { country: 'Montenegro', code: 'ME' },
  { country: 'Morocco', code: 'MA' },
  { country: 'Mozambique', code: 'MZ' },
  { country: 'Myanmar', code: 'MM' },
  { country: 'Namibia', code: 'NA' },
  { country: 'Nauru', code: 'NR' },
  { country: 'Nepal', code: 'NP' },
  { country: 'Netherlands', code: 'NL' },
  { country: 'New Zealand', code: 'NZ' },
  { country: 'Nicaragua', code: 'NI' },
  { country: 'Niger', code: 'NE' },
  { country: 'Nigeria', code: 'NG' },
  { country: 'North Macedonia', code: 'MK' },
  { country: 'Norway', code: 'NO' },
  { country: 'Oman', code: 'OM' },
  { country: 'Pakistan', code: 'PK' },
  { country: 'Palau', code: 'PW' },
  { country: 'Palestine', code: 'PS' },
  { country: 'Panama', code: 'PA' },
  { country: 'Papua New Guinea', code: 'PG' },
  { country: 'Paraguay', code: 'PY' },
  { country: 'Peru', code: 'PE' },
  { country: 'Philippines', code: 'PH' },
  { country: 'Poland', code: 'PL' },
  { country: 'Portugal', code: 'PT' },
  { country: 'Qatar', code: 'QA' },
  { country: 'Romania', code: 'RO' },
  { country: 'Russia', code: 'RU' },
  { country: 'Rwanda', code: 'RW' },
  { country: 'Saint Kitts and Nevis', code: 'KN' },
  { country: 'Saint Lucia', code: 'LC' },
  { country: 'Saint Vincent and the Grenadines', code: 'VC' },
  { country: 'Samoa', code: 'WS' },
  { country: 'San Marino', code: 'SM' },
  { country: 'Sao Tome and Principe', code: 'ST' },
  { country: 'Saudi Arabia', code: 'SA' },
  { country: 'Senegal', code: 'SN' },
  { country: 'Serbia', code: 'RS' },
  { country: 'Seychelles', code: 'SC' },
  { country: 'Sierra Leone', code: 'SL' },
  { country: 'Singapore', code: 'SG' },
  { country: 'Slovakia', code: 'SK' },
  { country: 'Slovenia', code: 'SI' },
  { country: 'Solomon Islands', code: 'SB' },
  { country: 'Somalia', code: 'SO' },
  { country: 'South Africa', code: 'ZA' },
  { country: 'South Sudan', code: 'SS' },
  { country: 'Spain', code: 'ES' },
  { country: 'Sri Lanka', code: 'LK' },
  { country: 'Sudan', code: 'SD' },
  { country: 'Suriname', code: 'SR' },
  { country: 'Swaziland', code: 'SZ' },
  { country: 'Sweden', code: 'SE' },
  { country: 'Switzerland', code: 'CH' },
  { country: 'Syria', code: 'SY' },
  { country: 'Taiwan', code: 'TW' },
  { country: 'Tajikistan', code: 'TJ' },
  { country: 'Tanzania', code: 'TZ' },
  { country: 'Thailand', code: 'TH' },
  { country: 'Timor-Leste', code: 'TL' },
  { country: 'Togo', code: 'TG' },
  { country: 'Tonga', code: 'TO' },
  { country: 'Trinidad and Tobago', code: 'TT' },
  { country: 'Tunisia', code: 'TN' },
  { country: 'Turkey', code: 'TR' },
  { country: 'Turkmenistan', code: 'TM' },
  { country: 'Tuvalu', code: 'TV' },
  { country: 'Uganda', code: 'UG' },
  { country: 'Ukraine', code: 'UA' },
  { country: 'United Arab Emirates', code: 'AE' },
  { country: 'United Kingdom', code: 'GB' },
  { country: 'United States', code: 'US' },
  { country: 'Uruguay', code: 'UY' },
  { country: 'Uzbekistan', code: 'UZ' },
  { country: 'Vanuatu', code: 'VU' },
  { country: 'Venezuela', code: 'VE' },
  { country: 'Vietnam', code: 'VN' },
  { country: 'Yemen', code: 'YE' },
  { country: 'Zambia', code: 'ZM' },
  { country: 'Zimbabwe', code: 'ZW' },
];

export const Block = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#0d1014' : '#ffffff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    height: '100%',
    color: theme.palette.text.secondary,
    boxShadow: `6px 8px 5px 0px ${theme.palette.mode === 'light' ? 'rgba(156,156,156,0.75)' : 'rgba(43,43,43,0.75)'}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  }));

export const BlockContent = styled(Paper)(({ theme }) => ({
    backgroundColor: 'transparent',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundImage: 'none',
    boxShadow: 'none'
}));

export function handleRolesSelectData(data) {
  var response = [];
    data.forEach((role) => {
      const { name, type } = role;
      response[name] = type;
    });

    return response;
}

export function handleDynamicData(data, index, value) {
  var roles_data = [];
    data.forEach((element) => {
      roles_data[index === 'fullname' ? `${element.firstname} ${element.lastname}` : element[index]] = element[value];
    });

    return roles_data;
}

export const getIconComponent = (iconName) => {
  const IconComponent = icons[iconName];
  if (IconComponent) {
    return <IconComponent />;
  }
  // Handle case when the icon is not found
  return null;
};

export const calculateStudentTuitions = (userCourses, coursesData) => {
  var price = 0;
  userCourses.forEach(course => {
    var cData = coursesData.find(c => c._id === course);
    if (cData) {
      var course_price = cData['Tuition Cost'].replace('$', '');
      course_price = course_price.replace(',', '');
      price += parseInt(course_price);
    }
  });

  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export const getNextHoliday = () => {
  return new Promise((resolve, reject) => {
    axios.get('https://date.nager.at/api/v3/PublicHolidays/2023/US')
      .then((res) => {
        if (res.data) {
          const currentDate = new Date();
          const nextHolidays = res.data.filter(holiday => new Date(holiday.date) > currentDate);

          if (nextHolidays.length > 0) {
            nextHolidays.sort((a, b) => new Date(a.date) - new Date(b.date));
            const holidateDate = new Date(nextHolidays[0].date);
            const formattedDate = `${holidateDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})} ${nextHolidays[0].name}`;
            resolve(formattedDate);
          } else {
            resolve('Next Holiday for next year');
          }
        }
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};