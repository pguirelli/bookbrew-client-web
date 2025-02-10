import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Checkbox,
  FormControlLabel,
  TableSortLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface BrandType {
    id: number;
    name: string;
    status: boolean;
  } 

type Order = 'asc' | 'desc';

const validationSchema = yup.object({
  name: yup.string().required('Descrição é obrigatória'),
  status: yup.boolean()
});

export const ManageBrand = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [brands, setBrands] = useState<BrandType[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof BrandType>('name');
    // Add these state variables after other useState declarations
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Add these handlers
    const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    };
    

    const handleRequestSort = (property: keyof BrandType) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };
  
    // Add filtered and sorted brands
    const filteredAndSortedBrands = React.useMemo(() => {
        return [...brands]
        .filter(brand => 
            brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (brand.status ? 'ativo' : 'inativo').includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (order === 'asc') {
            return a[orderBy] < b[orderBy] ? -1 : 1;
            } else {
            return b[orderBy] < a[orderBy] ? -1 : 1;
            }
        });
    }, [brands, order, orderBy, searchTerm]);

    const formik = useFormik({
        initialValues: {
        name: '',
        status: true 
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
        try {
            if (editingId) {
            // Update existing brand
            const updatedBrands = brands.map(brand => 
                brand.id === editingId ? { ...values, id: editingId } : brand
            );
            setBrands(updatedBrands);
            setEditingId(null);
            } else {
            // Add new brand
            setBrands([...brands, { ...values, id: Date.now() }]);
            }
            formik.resetForm();
        } catch (error) {
            console.error('Operation error:', error);
        }
        },
    });

    const handleEdit = (brand: BrandType) => {
        setEditingId(brand.id);
        formik.setValues({
        name: brand.name,
        status: brand.status
        });
    };

    const handleDelete = (brandId) => {
        setBrands(brands.filter(brand => brand.id !== brandId));
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 800, margin: '0 auto' }}>
            <Typography variant="h5" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
            {editingId ? 'Editar Marca de Produto' : 'Cadastro de Marcas de Produto'}
            </Typography>

            <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={10}>
                <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Descrição"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <FormControlLabel
                        control={
                        <Checkbox
                            id="status"
                            name="status"
                            checked={formik.values.status}
                            onChange={formik.handleChange}
                        />
                        }
                        label="Status"
                    />
                </Grid>

                <Grid item xs={12}>
                <Button 
                    fullWidth 
                    variant="contained" 
                    type="submit" 
                    sx={{ mt: 3 }}
                >
                    {editingId ? 'Atualizar' : 'Cadastrar'}
                </Button>
                </Grid>
            </Grid>
            </form>
        </Paper>

        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 800, margin: '0 auto' }}>
            <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
            Marcas Cadastradas
            </Typography>
            
            <TextField
                fullWidth
                id="search"
                label="Buscar marcas"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
            />
            
            <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                        <TableSortLabel
                            active={orderBy === 'name'}
                            direction={orderBy === 'name' ? order : 'asc'}
                            onClick={() => handleRequestSort('name')}
                        >
                            Descrição
                        </TableSortLabel>
                        </TableCell>
                        <TableCell>
                        <TableSortLabel
                            active={orderBy === 'status'}
                            direction={orderBy === 'status' ? order : 'asc'}
                            onClick={() => handleRequestSort('status')}
                        >
                            Status
                        </TableSortLabel>
                        </TableCell>
                        <TableCell align="right">Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {filteredAndSortedBrands
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((brand) => (
                    <TableRow key={brand.id}>
                    <TableCell>{brand.name}</TableCell>
                    <TableCell>
                        {brand.status ? 'Ativo' : 'Inativo'}
                    </TableCell>
                    <TableCell align="right">
                        <IconButton onClick={() => handleEdit(brand)}>
                        <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(brand.id)}>
                        <DeleteIcon />
                        </IconButton>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[10, 20]}
                component="div"
                count={filteredAndSortedBrands.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Registros por página"
            />
            </TableContainer>
        </Paper>
        </Box>
    );
};
