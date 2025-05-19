import {
  Datagrid,
  List,
  Show,
  Tab,
  TabbedShowLayout,
  TextField
} from 'react-admin'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const Field = ({ label, source }: { label: string; source: string }) => (
  <div className="mb-2">
    <p className="text-sm font-bold">{label}</p>
    <TextField source={source} />
  </div>
)

export const WorkspacePanel = () => (
  <Tabs defaultValue="protocol" className="w-full p-4">
    <TabsList>
      <TabsTrigger value="protocol">Protocole</TabsTrigger>
      <TabsTrigger value="admin"> Admin</TabsTrigger>
      <TabsTrigger value="contacts">Contacts</TabsTrigger>
    </TabsList>
    <TabsContent value="protocol" className="rounded-lg bg-white/10 p-4">
      <Field label="ID" source="id" />
      <Field label="Status" source="Status" />
      <Field label="Titre du protocole" source="TITRE_du_protocole" />
      <Field label="Acronyme" source="Acronym" />
      <Field label="Date de réception" source="Date_recu" />
    </TabsContent>

    <TabsContent value="admin" className="rounded-lg bg-white/10 p-4">
      <Field label="BASEC" source="BASEC" />
      <Field label="BPR First" source="BPR_First" />
      <Field label="CRC Recomm suivies" source="CRC_Recomm_suivies" />
      <Field label="CODE BPR" source="CODE_BPR" />
      <Field label="Dpt" source="Dpt" />
      <Field label="Service" source="Service" />
      <Field label="PI email" source="PI_email" />
      <Field
        label="Main contact email Study Coordinator"
        source="Main_contact_email_Study_co"
      />
    </TabsContent>

    <TabsContent value="contacts" className="w-full">
      <div className="grid grid-cols-2 gap-2">
        <Field label="CG Cons spécif" source="CG_Cons_spécif" />
        <Field label="Mineurs" source="Mineurs" />
        <Field label="Population vulnérable" source="Population_vulnerable" />
        <Field label="ICF Emergency" source="ICF_Emergency" />
        <Field label="CRF" source="CRF" />
        <Field label="Langue" source="Langue" />
      </div>
    </TabsContent>
  </Tabs>
)

export const WorkspaceList = () => (
  <List>
    <Datagrid
      expand={WorkspacePanel}
      size="small"
      sx={{
        '& .RaDatagrid-headerCell': {
          fontWeight: 'bold'
        },
        '& .column-BASEC, & .column-Service': {
          maxWidth: '24em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        },
        '& .column-TITRE_du_protocole': {
          maxWidth: '24em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      }}
    >
      <TextField source="Status" />
      <TextField label="Date de réception" source="Date_recu" />
      <TextField label="BASEC" source="BASEC" />
      <TextField label="Titre du protocole" source="TITRE_du_protocole" />
      <TextField label="CODE BPR" source="CODE_BPR" />
      <TextField label="Dpt" source="Dpt" />
      <TextField label="Service" source="Service" />
      <TextField label="PI email" source="PI_email" />
    </Datagrid>
  </List>
)

export const WorkspaceShow = () => (
  <Show>
    <div className="flex flex-col gap-2">
      <TextField label="Titre du protocole" source="TITRE_du_protocole" />
      <TextField label="CODE BPR" source="CODE_BPR" />
    </div>

    <TabbedShowLayout>
      <Tab label="Protocole">
        <Field label="ID" source="id" />
        <Field label="Status" source="Status" />
        <Field label="Titre du protocole" source="TITRE_du_protocole" />
        <Field label="Acronyme" source="Acronym" />
        <Field label="Date de réception" source="Date_recu" />
      </Tab>
      <Tab label="Admin">
        <Field label="BASEC" source="BASEC" />
        <Field label="BPR First" source="BPR_First" />
        <Field label="CRC Recomm suivies" source="CRC_Recomm_suivies" />
      </Tab>
      <Tab label="Contacts">
        <Field label="CG Cons spécif" source="CG_Cons_spécif" />
        <Field label="Mineurs" source="Mineurs" />
        <Field label="Population vulnérable" source="Population_vulnerable" />
        <Field label="ICF Emergency" source="ICF_Emergency" />
        <Field label="CRF" source="CRF" />
        <Field label="Langue" source="Langue" />
      </Tab>
    </TabbedShowLayout>
  </Show>
)
