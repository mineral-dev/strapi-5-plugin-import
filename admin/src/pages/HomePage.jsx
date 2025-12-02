import { Main, Link, Box, Button, CardBody, CardTitle, ContentLayout, Divider, Flex, Grid, GridItem, Stack, Typography } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { getTranslation } from '../utils/getTranslation';
import { PLUGIN_ID } from '../pluginId';
import { Book, Upload } from "@strapi/icons";
import { useState } from 'react';

const HomePage = () => {
  const { formatMessage } = useIntl();
  const [ file, setFile ] = useState(null);
  const [ uploading, setUploading ] = useState(false);
  const [ fileUser, setFileUser ] = useState(null);
  const [ uploadingUser, setUploadingUser ] = useState(false);

  const handleImport = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await fetch('/api/strapi-5-plugin-import/import-orders', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      alert(result.message || 'Import selesai');
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Gagal mengimport file.');
    } finally {
      setUploading(false);
    }
  };

  const handleImportUser = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await fetch('/api/strapi-5-plugin-import/import-users', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      alert(result.message || 'Import selesai');
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Gagal mengimport file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Main paddingLeft={6} paddingRight={6} paddingTop={6} paddingBottom={6} style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
      <Flex direction="column" justifyContent="center" alignItems="center" marginRight={"100px"}>
        <Typography variant="alpha">Import Orders</Typography>
        <Flex direction="column" paddingTop={4} justifyContent="center" alignItems="center">
          <Flex paddingBottom={4} justifyContent="center" alignItems="center">
            <label style={{ width: '50%' }} htmlFor="import-file">
              <Typography variant="pi" fontWeight="bold">
                Upload file (.csv)
              </Typography>
            </label>
            <input
              style={{ width: '50%' }}
              id="import-file"
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Flex>

          <Button
            startIcon={<Upload />}
            disabled={!file || uploading}
            loading={uploading}
            onClick={handleImport}
            size="L"
          >
            Import File
          </Button>
        </Flex>
      </Flex>
      <Flex direction="column" justifyContent="center" alignItems="center">
        <Typography variant="alpha">Import User</Typography>
        <Flex direction="column" paddingTop={4} justifyContent="center" alignItems="center">
          <Flex paddingBottom={4} justifyContent="center" alignItems="center">
            <label style={{ width: '50%' }} htmlFor="import-file">
              <Typography variant="pi" fontWeight="bold">
                Upload file (.csv)
              </Typography>
            </label>
            <input
              style={{ width: '50%' }}
              id="import-file"
              type="file"
              accept=".csv"
              onChange={(e) => setFileUser(e.target.files[0])}
            />
          </Flex>

          <Button
            startIcon={<Upload />}
            disabled={!fileUser || uploadingUser}
            loading={uploadingUser}
            onClick={handleImportUser}
            size="L"
          >
            Import File
          </Button>
        </Flex>
      </Flex>
    </Main>
  );
};

export { HomePage };
