import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import * as icons from "@mui/icons-material";

export const Block = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#ffffff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    height: '100%',
    color: theme.palette.text.secondary,
    boxShadow: '7px 5px 12px -4px rgba(148,148,148,1)',
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
      roles_data[index === 'fullname' ? `${element.firstname} ${element.lastname}` : index] = element[value];
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