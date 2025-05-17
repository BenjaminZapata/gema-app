-- CreateTable
CREATE TABLE `categorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detalledeventas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ventacodigo` INTEGER NOT NULL,
    `productocodigo` VARCHAR(191) NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `preciounitario` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gastos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `tipo` ENUM('Servicios', 'Sueldos', 'Envíos', 'Pedidos', 'Alquiler', 'Alquiler_impresoras', 'Cuotas', 'Seguros', 'Monotributo', 'Otros', 'Expensas') NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `observaciones` VARCHAR(191) NULL,
    `total` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mediosdepago` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `observaciones` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productos` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `categoria` INTEGER NOT NULL,
    `preciocompra` INTEGER NOT NULL,
    `precioventa` INTEGER NOT NULL,
    `stock` INTEGER NOT NULL,
    `stockminimo` INTEGER NOT NULL,
    `tiendaonline` INTEGER NOT NULL,
    `fechavencimiento` DATETIME(3) NULL,
    `proveedor` INTEGER NOT NULL,
    `observaciones` VARCHAR(191) NULL,
    `fechamodificacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proveedor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `direccion` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `pagina` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ventas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mediosdepago` INTEGER NOT NULL,
    `total` INTEGER NOT NULL,
    `fecha` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `detalledeventas` ADD CONSTRAINT `detalledeventas_ventacodigo_fkey` FOREIGN KEY (`ventacodigo`) REFERENCES `ventas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detalledeventas` ADD CONSTRAINT `detalledeventas_productocodigo_fkey` FOREIGN KEY (`productocodigo`) REFERENCES `productos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productos` ADD CONSTRAINT `productos_categoria_fkey` FOREIGN KEY (`categoria`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productos` ADD CONSTRAINT `productos_proveedor_fkey` FOREIGN KEY (`proveedor`) REFERENCES `proveedor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ventas` ADD CONSTRAINT `ventas_mediosdepago_fkey` FOREIGN KEY (`mediosdepago`) REFERENCES `mediosdepago`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
