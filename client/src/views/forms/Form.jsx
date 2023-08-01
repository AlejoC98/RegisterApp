import React, { lazy, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { Box, Grid } from '@mui/material';
import { Block } from '../../components/global';
import BreadCrumb from '../../components/BreadCrumb';

const importForm = formName =>
  lazy(() =>
    import(`../../components/forms/${formName}Form`).catch(() =>
      import(`../../components/forms/NullForm`)
    )
  );

const Create = () => {

  const location = useLocation();
  let { pathname } = location;
  pathname = pathname.replace(/%20/g, " ");
  const [formComponent, setFormComponent] = useState(null);

  useEffect(() => {

    const loadFormComponent = async () => {
      let FormComponent = importForm(formName);
      setFormComponent(<FormComponent key={nanoid()} />);
    };

    let params = pathname.split('/');
    params = params.filter(p => p);
    let formName = params[1];
    formName = formName.replace(/ /g, "");
    loadFormComponent();

  }, [pathname]);

  return (
    <Box>
      <Box mb={3}>
        <BreadCrumb path={pathname} />
      </Box>
      <Grid container spacing={2}>
        <Grid item md={12}>
          <Block>{formComponent}</Block>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Create