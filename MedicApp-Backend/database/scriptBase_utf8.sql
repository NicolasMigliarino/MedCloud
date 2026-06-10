USE [MedicApp]
GO
/****** Object:  User [medicapp_user]    Script Date: 28/5/2026 01:11:32 ******/
CREATE USER [medicapp_user] FOR LOGIN [medicapp_user] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [medicapp_user]
GO
/****** Object:  Table [dbo].[administrativos]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[administrativos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[usuario_id] [int] NOT NULL,
	[nombre] [nvarchar](100) NOT NULL,
	[apellido] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[archivos_medicos]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[archivos_medicos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[paciente_id] [int] NOT NULL,
	[turno_id] [int] NULL,
	[nombre_original] [nvarchar](255) NOT NULL,
	[nombre_archivo] [nvarchar](255) NOT NULL,
	[tipo_archivo] [nvarchar](50) NOT NULL,
	[fecha_subida] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[caja_diaria]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[caja_diaria](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[fecha] [date] NOT NULL,
	[monto_apertura] [decimal](10, 2) NOT NULL,
	[monto_cierre_esperado] [decimal](10, 2) NULL,
	[monto_cierre_real] [decimal](10, 2) NULL,
	[diferencia] [decimal](10, 2) NULL,
	[estado] [varchar](20) NOT NULL,
	[usuario_apertura_id] [int] NOT NULL,
	[usuario_cierre_id] [int] NULL,
	[fecha_apertura] [datetime] NOT NULL,
	[fecha_cierre] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[historial_clinico]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[historial_clinico](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[paciente_id] [int] NOT NULL,
	[profesional_id] [int] NOT NULL,
	[turno_id] [int] NULL,
	[fecha_registro] [datetime] NULL,
	[motivo] [nvarchar](255) NULL,
	[evolucion] [nvarchar](max) NOT NULL,
	[diagnostico] [nvarchar](255) NULL,
	[tratamiento] [nvarchar](max) NULL,
	[archivos_adjuntos_url] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[horarios_profesional]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[horarios_profesional](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[profesional_id] [int] NOT NULL,
	[dia_semana] [int] NOT NULL,
	[hora_inicio] [time](7) NOT NULL,
	[hora_fin] [time](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[obras_sociales]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[obras_sociales](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [nvarchar](100) NOT NULL,
	[activo] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[pacientes]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[pacientes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[dni] [nvarchar](20) NOT NULL,
	[nombre] [nvarchar](100) NOT NULL,
	[apellido] [nvarchar](100) NOT NULL,
	[fecha_nacimiento] [date] NULL,
	[telefono] [nvarchar](50) NULL,
	[email] [nvarchar](100) NULL,
	[obra_social] [nvarchar](100) NULL,
	[numero_afiliado] [nvarchar](100) NULL,
	[fecha_alta] [datetime] NULL,
	[obra_social_id] [int] NULL,
	[sexo] [nvarchar](50) NULL,
	[grupo_sanguineo] [nvarchar](20) NULL,
	[direccion] [nvarchar](255) NULL,
	[contacto_emergencia] [nvarchar](255) NULL,
	[alergias] [nvarchar](1000) NULL,
 CONSTRAINT [PK__paciente__3213E83F3B1418ED] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[pagos]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[pagos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[turno_id] [int] NOT NULL,
	[caja_diaria_id] [int] NULL,
	[monto_bruto] [decimal](10, 2) NOT NULL,
	[porcentaje_retencion] [decimal](5, 2) NOT NULL,
	[monto_retencion_clinica]  AS (CONVERT([decimal](10,2),[monto_bruto]*([porcentaje_retencion]/(100.0)))),
	[monto_neto_medico]  AS (CONVERT([decimal](10,2),[monto_bruto]*((1.0)-[porcentaje_retencion]/(100.0)))),
	[metodo_pago] [varchar](50) NOT NULL,
	[fecha_pago] [datetime] NOT NULL,
	[usuario_registro_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Permisos_Historial]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Permisos_Historial](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[historial_id] [int] NOT NULL,
	[profesional_invitado_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[profesionales]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[profesionales](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[usuario_id] [int] NULL,
	[nombre] [nvarchar](100) NOT NULL,
	[apellido] [nvarchar](100) NOT NULL,
	[matricula] [nvarchar](50) NULL,
	[especialidad] [nvarchar](100) NULL,
	[telefono] [nvarchar](50) NULL,
	[duracion_turno_promedio] [int] NULL,
	[porcentaje_retencion] [decimal](5, 2) NOT NULL,
	[tipo_matricula] [nvarchar](20) NULL,
	[cuit_cuil] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[roles]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[roles](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [nvarchar](50) NOT NULL,
	[codigo] [nvarchar](20) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[turnos]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[turnos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[profesional_id] [int] NOT NULL,
	[paciente_id] [int] NOT NULL,
	[fecha_hora_inicio] [datetime] NOT NULL,
	[fecha_hora_fin] [datetime] NOT NULL,
	[estado] [nvarchar](20) NULL,
	[motivo_consulta] [nvarchar](255) NULL,
	[observaciones_admin] [nvarchar](max) NULL,
	[monto_abonado] [decimal](10, 2) NULL,
	[metodo_pago] [varchar](50) NULL,
	[fecha_pago] [datetime] NULL,
	[recordatorio_enviado] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[usuarios]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[usuarios](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[email] [nvarchar](100) NOT NULL,
	[password_hash] [nvarchar](255) NOT NULL,
	[rol_id] [int] NOT NULL,
	[activo] [bit] NULL,
	[fecha_creacion] [datetime] NULL,
	[username] [varchar](50) NULL,
	[debe_cambiar_pass] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[administrativos] ON 

INSERT [dbo].[administrativos] ([id], [usuario_id], [nombre], [apellido]) VALUES (1, 1, N'bruno', N'Migliarino')
INSERT [dbo].[administrativos] ([id], [usuario_id], [nombre], [apellido]) VALUES (2, 1, N'Nico', N'Migliarino')
SET IDENTITY_INSERT [dbo].[administrativos] OFF
GO
SET IDENTITY_INSERT [dbo].[archivos_medicos] ON 

INSERT [dbo].[archivos_medicos] ([id], [paciente_id], [turno_id], [nombre_original], [nombre_archivo], [tipo_archivo], [fecha_subida]) VALUES (1, 4, NULL, N'MercadoPago.pdf', N'1772770370490-800913851.pdf', N'application/pdf', CAST(N'2026-03-06T01:12:50.497' AS DateTime))
SET IDENTITY_INSERT [dbo].[archivos_medicos] OFF
GO
SET IDENTITY_INSERT [dbo].[caja_diaria] ON 

INSERT [dbo].[caja_diaria] ([id], [fecha], [monto_apertura], [monto_cierre_esperado], [monto_cierre_real], [diferencia], [estado], [usuario_apertura_id], [usuario_cierre_id], [fecha_apertura], [fecha_cierre]) VALUES (1, CAST(N'2026-05-20' AS Date), CAST(5000.00 AS Decimal(10, 2)), CAST(25000.00 AS Decimal(10, 2)), CAST(35000.00 AS Decimal(10, 2)), CAST(10000.00 AS Decimal(10, 2)), N'Cerrada', 6, 6, CAST(N'2026-05-20T23:41:00.137' AS DateTime), CAST(N'2026-05-20T23:49:27.463' AS DateTime))
INSERT [dbo].[caja_diaria] ([id], [fecha], [monto_apertura], [monto_cierre_esperado], [monto_cierre_real], [diferencia], [estado], [usuario_apertura_id], [usuario_cierre_id], [fecha_apertura], [fecha_cierre]) VALUES (2, CAST(N'2026-05-21' AS Date), CAST(5000.00 AS Decimal(10, 2)), CAST(30000.00 AS Decimal(10, 2)), CAST(30000.00 AS Decimal(10, 2)), CAST(0.00 AS Decimal(10, 2)), N'Cerrada', 6, 6, CAST(N'2026-05-21T00:01:36.070' AS DateTime), CAST(N'2026-05-21T00:02:41.077' AS DateTime))
SET IDENTITY_INSERT [dbo].[caja_diaria] OFF
GO
SET IDENTITY_INSERT [dbo].[historial_clinico] ON 

INSERT [dbo].[historial_clinico] ([id], [paciente_id], [profesional_id], [turno_id], [fecha_registro], [motivo], [evolucion], [diagnostico], [tratamiento], [archivos_adjuntos_url]) VALUES (5, 3, 18, NULL, CAST(N'2026-02-23T03:18:10.143' AS DateTime), N'addad', N'adwad', N'asdsadsa', N'adasdads', N'')
INSERT [dbo].[historial_clinico] ([id], [paciente_id], [profesional_id], [turno_id], [fecha_registro], [motivo], [evolucion], [diagnostico], [tratamiento], [archivos_adjuntos_url]) VALUES (6, 3, 18, NULL, CAST(N'2026-02-23T03:18:25.553' AS DateTime), N'dvdsfgsdf', N'sdfdsfsd', N'sdfdsfsdf', N'sdfsdfsdf', N'')
INSERT [dbo].[historial_clinico] ([id], [paciente_id], [profesional_id], [turno_id], [fecha_registro], [motivo], [evolucion], [diagnostico], [tratamiento], [archivos_adjuntos_url]) VALUES (7, 3, 18, NULL, CAST(N'2026-02-23T03:25:33.220' AS DateTime), N'ffdgfdg', N'asdsadasdas', N'adsad', N'asdvdszczxc', N'')
INSERT [dbo].[historial_clinico] ([id], [paciente_id], [profesional_id], [turno_id], [fecha_registro], [motivo], [evolucion], [diagnostico], [tratamiento], [archivos_adjuntos_url]) VALUES (8, 3, 18, NULL, CAST(N'2026-02-23T03:25:58.343' AS DateTime), N'qewqewqe', N'qwewewae', N'qewqewq', N'qwewqewqe', N'')
INSERT [dbo].[historial_clinico] ([id], [paciente_id], [profesional_id], [turno_id], [fecha_registro], [motivo], [evolucion], [diagnostico], [tratamiento], [archivos_adjuntos_url]) VALUES (9, 3, 18, NULL, CAST(N'2026-02-23T09:51:57.177' AS DateTime), N'qqqqq', N'qqq', N'qqq', N'qqq', N'')
INSERT [dbo].[historial_clinico] ([id], [paciente_id], [profesional_id], [turno_id], [fecha_registro], [motivo], [evolucion], [diagnostico], [tratamiento], [archivos_adjuntos_url]) VALUES (10, 3, 18, NULL, CAST(N'2026-02-23T10:17:41.380' AS DateTime), N'wwwww', N'wwww', N'wwww', N'wwww', N'')
INSERT [dbo].[historial_clinico] ([id], [paciente_id], [profesional_id], [turno_id], [fecha_registro], [motivo], [evolucion], [diagnostico], [tratamiento], [archivos_adjuntos_url]) VALUES (11, 3, 18, NULL, CAST(N'2026-02-23T10:24:55.730' AS DateTime), N'qqqqq', N'qqqq', N'qqqq', N'qqqq', N'')
INSERT [dbo].[historial_clinico] ([id], [paciente_id], [profesional_id], [turno_id], [fecha_registro], [motivo], [evolucion], [diagnostico], [tratamiento], [archivos_adjuntos_url]) VALUES (12, 3, 18, NULL, CAST(N'2026-02-23T11:04:18.370' AS DateTime), N'sadfsedf', N'sdfsdfsdfsedf', N'sdfsdf', N'sdfdsfdsfsdf', N'')
INSERT [dbo].[historial_clinico] ([id], [paciente_id], [profesional_id], [turno_id], [fecha_registro], [motivo], [evolucion], [diagnostico], [tratamiento], [archivos_adjuntos_url]) VALUES (13, 3, 18, NULL, CAST(N'2026-02-23T11:04:35.433' AS DateTime), N'hola', N'GOLA', N'ghoa', N'GOLA', N'')
INSERT [dbo].[historial_clinico] ([id], [paciente_id], [profesional_id], [turno_id], [fecha_registro], [motivo], [evolucion], [diagnostico], [tratamiento], [archivos_adjuntos_url]) VALUES (1004, 3, 18, NULL, CAST(N'2026-02-26T01:24:01.130' AS DateTime), N'asdasd', N'asdsadsa', N'asdsad', N'asdasdsa', N'')
INSERT [dbo].[historial_clinico] ([id], [paciente_id], [profesional_id], [turno_id], [fecha_registro], [motivo], [evolucion], [diagnostico], [tratamiento], [archivos_adjuntos_url]) VALUES (1005, 4, 18, NULL, CAST(N'2026-03-06T01:55:43.213' AS DateTime), N'depresion', N'sadsadsadsadzxcvsedhshczv', N'tdh', N'asfsa>SCasfgvdsv', N'')
SET IDENTITY_INSERT [dbo].[historial_clinico] OFF
GO
SET IDENTITY_INSERT [dbo].[horarios_profesional] ON 

INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (1, 26, 1, CAST(N'09:00:00' AS Time), CAST(N'14:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (2, 26, 3, CAST(N'09:00:00' AS Time), CAST(N'14:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (3, 1022, 1, CAST(N'10:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (4, 1022, 3, CAST(N'11:00:00' AS Time), CAST(N'15:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (5, 1022, 5, CAST(N'13:00:00' AS Time), CAST(N'17:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (6, 1023, 2, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (7, 1024, 2, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (8, 1025, 2, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (9, 1026, 2, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (10, 1027, 2, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (11, 1028, 2, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (12, 1029, 2, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (13, 1030, 2, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (14, 1031, 2, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (15, 1032, 2, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (16, 1033, 5, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (17, 1033, 6, CAST(N'09:00:00' AS Time), CAST(N'13:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (18, 1034, 2, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (19, 1035, 2, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (20, 1036, 2, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (21, 1037, 2, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (22, 1038, 2, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (23, 1039, 2, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (24, 1040, 2, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (25, 1041, 2, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (26, 1042, 2, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (27, 1043, 2, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (28, 1044, 2, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
INSERT [dbo].[horarios_profesional] ([id], [profesional_id], [dia_semana], [hora_inicio], [hora_fin]) VALUES (29, 1045, 2, CAST(N'09:00:00' AS Time), CAST(N'18:00:00' AS Time))
SET IDENTITY_INSERT [dbo].[horarios_profesional] OFF
GO
SET IDENTITY_INSERT [dbo].[obras_sociales] ON 

INSERT [dbo].[obras_sociales] ([id], [nombre], [activo]) VALUES (1, N'Particular (Sin Obra Social)', 1)
INSERT [dbo].[obras_sociales] ([id], [nombre], [activo]) VALUES (2, N'PAMI', 1)
INSERT [dbo].[obras_sociales] ([id], [nombre], [activo]) VALUES (3, N'IOMA', 1)
INSERT [dbo].[obras_sociales] ([id], [nombre], [activo]) VALUES (4, N'OSDE', 1)
INSERT [dbo].[obras_sociales] ([id], [nombre], [activo]) VALUES (5, N'OSECAC', 1)
INSERT [dbo].[obras_sociales] ([id], [nombre], [activo]) VALUES (6, N'GALENO', 1)
INSERT [dbo].[obras_sociales] ([id], [nombre], [activo]) VALUES (7, N'SWISS MEDICAL', 1)
INSERT [dbo].[obras_sociales] ([id], [nombre], [activo]) VALUES (8, N'OMINT', 1)
INSERT [dbo].[obras_sociales] ([id], [nombre], [activo]) VALUES (9, N'MEDIFE', 1)
INSERT [dbo].[obras_sociales] ([id], [nombre], [activo]) VALUES (10, N'OSPLAD', 1)
INSERT [dbo].[obras_sociales] ([id], [nombre], [activo]) VALUES (11, N'BANCARIOS', 1)
INSERT [dbo].[obras_sociales] ([id], [nombre], [activo]) VALUES (12, N'CAMIONEROS', 1)
INSERT [dbo].[obras_sociales] ([id], [nombre], [activo]) VALUES (13, N'JERARQUICOS', 1)
INSERT [dbo].[obras_sociales] ([id], [nombre], [activo]) VALUES (14, N'IOSFA', 1)
INSERT [dbo].[obras_sociales] ([id], [nombre], [activo]) VALUES (15, N'DASPU', 1)
INSERT [dbo].[obras_sociales] ([id], [nombre], [activo]) VALUES (16, N'APROSS', 1)
INSERT [dbo].[obras_sociales] ([id], [nombre], [activo]) VALUES (17, N'GAL', 1)
INSERT [dbo].[obras_sociales] ([id], [nombre], [activo]) VALUES (18, N'NOBIS', 1)
INSERT [dbo].[obras_sociales] ([id], [nombre], [activo]) VALUES (19, N'OM', 1)
SET IDENTITY_INSERT [dbo].[obras_sociales] OFF
GO
SET IDENTITY_INSERT [dbo].[pacientes] ON 

INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (3, N'87654329', N'Nicolas', N'Miglia', CAST(N'1995-10-20' AS Date), N'11-9999-8888', N'maria@gmail.com', N'Swiss Medical', N'SM-998877', CAST(N'2025-12-15T11:34:13.273' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (4, N'11122237', N'Test', N'Usuario', NULL, N'5491161820425', N'test@mail.com', NULL, NULL, CAST(N'2026-01-21T18:33:36.897' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (7, N'33740443', N'Bruno', N'Migliarino', NULL, NULL, N'nmigliarino@gmail.com', NULL, NULL, CAST(N'2026-02-01T13:15:53.480' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (8, N'36353636', N'EVELYN DAIANA', N'LAMAS', NULL, N'5491161820425', N'eve_gemmy@hotmail.com', NULL, NULL, CAST(N'2026-02-01T13:17:01.420' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (11, N'33740442', N'Nicolas andres', N'Migliarino', NULL, N'541161820425', N'nmigliarino@gmail.com', NULL, NULL, CAST(N'2026-02-07T00:34:58.657' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (13, N'11122232', N'Claudia', N'serbi', CAST(N'2026-02-23' AS Date), N'541161820425', N'testa@mail.com', N'', N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (16, N'31345543', N'luis', N'suarez', CAST(N'2011-06-08' AS Date), N'5491161820425', N'sola@gmail.com', N'3', N'23432423234', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (17, N'31345546', N'luisa', N'gomez', CAST(N'2011-06-08' AS Date), N'1134567643', N'solata@gmail.com', N'7', N'23432423234', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1016, N'23456987', N'Jose', N'Maria', CAST(N'1990-04-12' AS Date), N'1123478908', N'josemaria@gmail.com', N'1', N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1017, N'44786543', N'Carlos', N'Vives', CAST(N'2009-02-04' AS Date), N'541161820425', N'carlosvives@gmail.co', N'3', N'234235', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1018, N'46062590', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_4606', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1019, N'22647310', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_2264', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1020, N'53744674', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_5374', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1021, N'16296118', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_1629', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1022, N'93964097', N'PAC_HORARIO_4097', N'FLOW', CAST(N'1995-05-15' AS Date), N'11 5555-4444', N'paciente_horario_939', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1023, N'72969263', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_7296', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1024, N'63781608', N'PAC_HORARIO_1608', N'FLOW', CAST(N'1995-05-15' AS Date), N'11 5555-4444', N'paciente_horario_637', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1025, N'31720533', N'PAC_HORARIO_0533', N'FLOW', CAST(N'1995-05-15' AS Date), N'11 5555-4444', N'paciente_horario_317', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1026, N'36579564', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_3657', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1027, N'65181414', N'PAC_HORARIO_1414', N'FLOW', CAST(N'1995-05-15' AS Date), N'11 5555-4444', N'paciente_horario_651', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1028, N'48067188', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_4806', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1029, N'23795042', N'PAC_HORARIO_5042', N'FLOW', CAST(N'1995-05-15' AS Date), N'11 5555-4444', N'paciente_horario_237', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1030, N'97771076', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_9777', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1031, N'80878352', N'PAC_HORARIO_8352', N'FLOW', CAST(N'1995-05-15' AS Date), N'11 5555-4444', N'paciente_horario_808', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1032, N'31876456', N'Mariano', N'iudica', CAST(N'2000-05-17' AS Date), N'1198763454', N'seoora@gmail.com', N'1', N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1033, N'73715012', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_7371', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1034, N'66109803', N'PAC_HORARIO_9803', N'FLOW', CAST(N'1995-05-15' AS Date), N'11 5555-4444', N'paciente_horario_661', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1035, N'85565421', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_8556', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1036, N'39835418', N'PAC_HORARIO_5418', N'FLOW', CAST(N'1995-05-15' AS Date), N'11 5555-4444', N'paciente_horario_398', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1037, N'74381755', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_7438', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1038, N'73790542', N'PAC_HORARIO_0542', N'FLOW', CAST(N'1995-05-15' AS Date), N'11 5555-4444', N'paciente_horario_737', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1039, N'91364313', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_9136', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1040, N'97556380', N'PAC_HORARIO_6380', N'FLOW', CAST(N'1995-05-15' AS Date), N'11 5555-4444', N'paciente_horario_975', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1041, N'46803747', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_4680', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1042, N'26146178', N'PAC_HORARIO_6178', N'FLOW', CAST(N'1995-05-15' AS Date), N'11 5555-4444', N'paciente_horario_261', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1043, N'56099333', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_5609', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1044, N'53679063', N'PAC_HORARIO_9063', N'FLOW', CAST(N'1995-05-15' AS Date), N'11 5555-4444', N'paciente_horario_536', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1045, N'34429807', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_3442', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1046, N'33328254', N'PAC_HORARIO_8254', N'FLOW', CAST(N'1995-05-15' AS Date), N'11 5555-4444', N'paciente_horario_333', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1047, N'68785704', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_6878', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1048, N'84311047', N'PAC_HORARIO_1047', N'FLOW', CAST(N'1995-05-15' AS Date), N'11 5555-4444', N'paciente_horario_843', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1049, N'75330575', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_7533', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1050, N'91456259', N'PAC_HORARIO_6259', N'FLOW', CAST(N'1995-05-15' AS Date), N'11 5555-4444', N'paciente_horario_914', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1051, N'10436205', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_1043', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1052, N'34018617', N'PAC_HORARIO_8617', N'FLOW', CAST(N'1995-05-15' AS Date), N'11 5555-4444', N'paciente_horario_340', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1053, N'17987748', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_1798', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1054, N'75471496', N'PAC_HORARIO_1496', N'FLOW', CAST(N'1995-05-15' AS Date), N'11 5555-4444', N'paciente_horario_754', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1055, N'94145325', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_9414', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1056, N'53255885', N'PAC_HORARIO_5885', N'FLOW', CAST(N'1995-05-15' AS Date), N'11 5555-4444', N'paciente_horario_532', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1057, N'27620348', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_2762', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1058, N'51573524', N'PAC_HORARIO_3524', N'FLOW', CAST(N'1995-05-15' AS Date), N'11 5555-4444', N'paciente_horario_515', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1059, N'20195140', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_2019', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1060, N'74991258', N'PAC_HORARIO_1258', N'FLOW', CAST(N'1995-05-15' AS Date), N'11 5555-4444', N'paciente_horario_749', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1061, N'88923459', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_8892', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1062, N'88387488', N'PAC_HORARIO_7488', N'FLOW', CAST(N'1995-05-15' AS Date), N'11 5555-4444', N'paciente_horario_883', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1063, N'15834932', N'TEST_PLAYWRIGHT', N'ADMIN_FLOW', CAST(N'1992-10-12' AS Date), N'11 9999-8888', N'playwright_test_1583', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[pacientes] ([id], [dni], [nombre], [apellido], [fecha_nacimiento], [telefono], [email], [obra_social], [numero_afiliado], [fecha_alta], [obra_social_id], [sexo], [grupo_sanguineo], [direccion], [contacto_emergencia], [alergias]) VALUES (1064, N'99355429', N'PAC_HORARIO_5429', N'FLOW', CAST(N'1995-05-15' AS Date), N'11 5555-4444', N'paciente_horario_993', NULL, N'', CAST(N'1900-01-01T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL)
SET IDENTITY_INSERT [dbo].[pacientes] OFF
GO
SET IDENTITY_INSERT [dbo].[pagos] ON 

INSERT [dbo].[pagos] ([id], [turno_id], [caja_diaria_id], [monto_bruto], [porcentaje_retencion], [metodo_pago], [fecha_pago], [usuario_registro_id]) VALUES (1, 2032, 1, CAST(15000.00 AS Decimal(10, 2)), CAST(20.00 AS Decimal(5, 2)), N'MercadoPago', CAST(N'2026-05-20T23:41:35.143' AS DateTime), 6)
INSERT [dbo].[pagos] ([id], [turno_id], [caja_diaria_id], [monto_bruto], [porcentaje_retencion], [metodo_pago], [fecha_pago], [usuario_registro_id]) VALUES (2, 2027, 1, CAST(20000.00 AS Decimal(10, 2)), CAST(20.00 AS Decimal(5, 2)), N'Efectivo', CAST(N'2026-05-20T23:42:24.670' AS DateTime), 6)
INSERT [dbo].[pagos] ([id], [turno_id], [caja_diaria_id], [monto_bruto], [porcentaje_retencion], [metodo_pago], [fecha_pago], [usuario_registro_id]) VALUES (3, 2037, 2, CAST(25000.00 AS Decimal(10, 2)), CAST(20.00 AS Decimal(5, 2)), N'Efectivo', CAST(N'2026-05-21T00:02:03.027' AS DateTime), 6)
SET IDENTITY_INSERT [dbo].[pagos] OFF
GO
SET IDENTITY_INSERT [dbo].[Permisos_Historial] ON 

INSERT [dbo].[Permisos_Historial] ([id], [historial_id], [profesional_invitado_id]) VALUES (1, 11, 19)
INSERT [dbo].[Permisos_Historial] ([id], [historial_id], [profesional_invitado_id]) VALUES (2, 10, 19)
INSERT [dbo].[Permisos_Historial] ([id], [historial_id], [profesional_invitado_id]) VALUES (3, 13, 19)
INSERT [dbo].[Permisos_Historial] ([id], [historial_id], [profesional_invitado_id]) VALUES (1002, 1005, 22)
SET IDENTITY_INSERT [dbo].[Permisos_Historial] OFF
GO
SET IDENTITY_INSERT [dbo].[profesionales] ON 

INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (18, 1, N'Hola', N'House', N'MN-9993', N'tula', N'11223344', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (19, NULL, N'testeo', N'1', NULL, N'odontologo', NULL, 0, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (20, 9, N'julio', N'boca', N'mp-2324', N'cardiologia', N'1133456765', 40, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (21, 11, N'claudio', N'torres', N'MN-9996', N'cirujano', N'1189234599', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (22, 12, N'cesar', N'falcioni', N'MN-9981', N'estrabismo', N'113445455', 60, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (26, 16, N'julio', N'morales', N'mp-1989', N'cardiologo', N'1161854432', 15, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1022, 1012, N'marlon', N'smith', N'MN-8872', N'Dermatologa', N'1156764321', 57, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1023, 1014, N'DOC_HORARIO_5807', N'FLOW', N'MP-77145', N'Odontología', N'', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1024, 1015, N'DOC_HORARIO_3625', N'FLOW', N'MP-60503', N'Odontología', N'', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1025, 1016, N'DOC_HORARIO_4267', N'FLOW', N'MP-30764', N'Odontología', N'', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1026, 1017, N'DOC_HORARIO_5348', N'FLOW', N'MP-44515', N'Odontología', N'', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1027, 1018, N'DOC_HORARIO_4767', N'FLOW', N'MP-71374', N'Odontología', N'', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1028, 1019, N'DOC_HORARIO_3952', N'FLOW', N'MP-93303', N'Odontología', N'', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1029, 1020, N'DOC_HORARIO_3088', N'FLOW', N'MP-74873', N'Odontología', N'', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1030, 1021, N'DOC_HORARIO_5662', N'FLOW', N'MP-52365', N'Odontología', N'', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1031, 1022, N'DOC_HORARIO_2242', N'FLOW', N'MP-23652', N'Odontología', N'', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1032, 1023, N'DOC_HORARIO_9489', N'FLOW', N'MP-45149', N'Odontología', N'', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1033, 1024, N'marta', N'lamas', N'MN-9966', N'Psicopedagoga', N'01161820445', 43, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1034, 1025, N'DOC_HORARIO_8162', N'FLOW', N'MP-53818', N'Odontología', N'', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1035, 1026, N'DOC_HORARIO_6544', N'FLOW', N'MP-91676', N'Odontología', N'', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1036, 1027, N'DOC_HORARIO_9863', N'FLOW', N'MP-60799', N'Odontología', N'', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1037, 1028, N'DOC_HORARIO_5059', N'FLOW', N'MP-74975', N'Odontología', N'', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1038, 1029, N'DOC_HORARIO_1432', N'FLOW', N'MP-82801', N'Odontología', N'', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1039, 1030, N'DOC_HORARIO_9520', N'FLOW', N'MP-44509', N'Odontología', N'', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1040, 1031, N'DOC_HORARIO_1120', N'FLOW', N'MP-73921', N'Odontología', N'', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1041, 1032, N'DOC_HORARIO_5597', N'FLOW', N'MP-44415', N'Odontología', N'', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1042, 1033, N'DOC_HORARIO_6580', N'FLOW', N'MP-38466', N'Odontología', N'', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1043, 1034, N'DOC_HORARIO_4579', N'FLOW', N'MP-70944', N'Odontología', N'', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1044, 1035, N'DOC_HORARIO_6302', N'FLOW', N'MP-17526', N'Odontología', N'', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
INSERT [dbo].[profesionales] ([id], [usuario_id], [nombre], [apellido], [matricula], [especialidad], [telefono], [duracion_turno_promedio], [porcentaje_retencion], [tipo_matricula], [cuit_cuil]) VALUES (1045, 1036, N'DOC_HORARIO_8461', N'FLOW', N'MP-32458', N'Odontología', N'', 30, CAST(20.00 AS Decimal(5, 2)), NULL, NULL)
SET IDENTITY_INSERT [dbo].[profesionales] OFF
GO
SET IDENTITY_INSERT [dbo].[roles] ON 

INSERT [dbo].[roles] ([id], [nombre], [codigo]) VALUES (1, N'QAS', N'QA_01')
INSERT [dbo].[roles] ([id], [nombre], [codigo]) VALUES (2, N'Administrador', N'ADMIN')
INSERT [dbo].[roles] ([id], [nombre], [codigo]) VALUES (4, N'Administrativo', N'RECEPCION')
INSERT [dbo].[roles] ([id], [nombre], [codigo]) VALUES (5, N'Profesional', N'MEDICO')
SET IDENTITY_INSERT [dbo].[roles] OFF
GO
SET IDENTITY_INSERT [dbo].[turnos] ON 

INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2027, 18, 3, CAST(N'2027-10-04T13:45:00.000' AS DateTime), CAST(N'2027-10-04T14:15:00.000' AS DateTime), N'Confirmado', N'TEST AUTOMATIZADO PLAYWRIGHT', N'Generado automáticamente para verificar flujo de Administrativo.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2032, 18, 3, CAST(N'2027-12-20T14:15:00.000' AS DateTime), CAST(N'2027-12-20T14:45:00.000' AS DateTime), N'Confirmado', N'TEST AUTOMATIZADO PLAYWRIGHT', N'Generado automáticamente para verificar flujo de Administrativo.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2037, 18, 3, CAST(N'2027-09-13T15:15:00.000' AS DateTime), CAST(N'2027-09-13T15:45:00.000' AS DateTime), N'Confirmado', N'TEST AUTOMATIZADO PLAYWRIGHT', N'Generado automáticamente para verificar flujo de Administrativo.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2038, 1030, 1036, CAST(N'2027-07-06T13:00:00.000' AS DateTime), CAST(N'2027-07-06T13:30:00.000' AS DateTime), N'Pendiente', N'CONSULTA CONTROL INTEGRAL', N'Prueba de horarios de Yanina.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2039, 18, 3, CAST(N'2027-06-21T16:30:00.000' AS DateTime), CAST(N'2027-06-21T17:00:00.000' AS DateTime), N'Pendiente', N'TEST AUTOMATIZADO PLAYWRIGHT', N'Generado automáticamente para verificar flujo de Administrativo.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2040, 1031, 1038, CAST(N'2027-02-02T13:00:00.000' AS DateTime), CAST(N'2027-02-02T13:30:00.000' AS DateTime), N'Pendiente', N'CONSULTA CONTROL INTEGRAL', N'Prueba de horarios de Yanina.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2041, 18, 3, CAST(N'2027-05-10T16:45:00.000' AS DateTime), CAST(N'2027-05-10T17:15:00.000' AS DateTime), N'Pendiente', N'TEST AUTOMATIZADO PLAYWRIGHT', N'Generado automáticamente para verificar flujo de Administrativo.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2042, 1032, 1040, CAST(N'2027-01-12T13:00:00.000' AS DateTime), CAST(N'2027-01-12T13:30:00.000' AS DateTime), N'Pendiente', N'CONSULTA CONTROL INTEGRAL', N'Prueba de horarios de Yanina.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2043, 1033, 1017, CAST(N'2026-05-22T12:45:00.000' AS DateTime), CAST(N'2026-05-22T13:28:00.000' AS DateTime), N'Pendiente', N'tea', N'ni didea', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2044, 18, 3, CAST(N'2027-03-15T14:30:00.000' AS DateTime), CAST(N'2027-03-15T15:00:00.000' AS DateTime), N'Pendiente', N'TEST AUTOMATIZADO PLAYWRIGHT', N'Generado automáticamente para verificar flujo de Administrativo.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2045, 1034, 1042, CAST(N'2027-09-21T13:00:00.000' AS DateTime), CAST(N'2027-09-21T13:30:00.000' AS DateTime), N'Pendiente', N'CONSULTA CONTROL INTEGRAL', N'Prueba de horarios de Yanina.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2046, 18, 3, CAST(N'2027-03-29T16:45:00.000' AS DateTime), CAST(N'2027-03-29T17:15:00.000' AS DateTime), N'Pendiente', N'TEST AUTOMATIZADO PLAYWRIGHT', N'Generado automáticamente para verificar flujo de Administrativo.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2047, 1035, 1044, CAST(N'2027-10-12T13:00:00.000' AS DateTime), CAST(N'2027-10-12T13:30:00.000' AS DateTime), N'Pendiente', N'CONSULTA CONTROL INTEGRAL', N'Prueba de horarios de Yanina.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2048, 18, 3, CAST(N'2027-01-11T16:00:00.000' AS DateTime), CAST(N'2027-01-11T16:30:00.000' AS DateTime), N'Pendiente', N'TEST AUTOMATIZADO PLAYWRIGHT', N'Generado automáticamente para verificar flujo de Administrativo.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2049, 1036, 1046, CAST(N'2027-03-02T13:00:00.000' AS DateTime), CAST(N'2027-03-02T13:30:00.000' AS DateTime), N'Pendiente', N'CONSULTA CONTROL INTEGRAL', N'Prueba de horarios de Yanina.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2050, 18, 3, CAST(N'2027-03-08T15:30:00.000' AS DateTime), CAST(N'2027-03-08T16:00:00.000' AS DateTime), N'Pendiente', N'TEST AUTOMATIZADO PLAYWRIGHT', N'Generado automáticamente para verificar flujo de Administrativo.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2051, 1037, 1048, CAST(N'2027-04-13T13:00:00.000' AS DateTime), CAST(N'2027-04-13T13:30:00.000' AS DateTime), N'Pendiente', N'CONSULTA CONTROL INTEGRAL', N'Prueba de horarios de Yanina.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2052, 18, 3, CAST(N'2027-05-17T14:15:00.000' AS DateTime), CAST(N'2027-05-17T14:45:00.000' AS DateTime), N'Pendiente', N'TEST AUTOMATIZADO PLAYWRIGHT', N'Generado automáticamente para verificar flujo de Administrativo.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2053, 1038, 1050, CAST(N'2027-09-07T13:00:00.000' AS DateTime), CAST(N'2027-09-07T13:30:00.000' AS DateTime), N'Pendiente', N'CONSULTA CONTROL INTEGRAL', N'Prueba de horarios de Yanina.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2054, 18, 3, CAST(N'2027-05-31T14:00:00.000' AS DateTime), CAST(N'2027-05-31T14:30:00.000' AS DateTime), N'Pendiente', N'TEST AUTOMATIZADO PLAYWRIGHT', N'Generado automáticamente para verificar flujo de Administrativo.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2055, 1039, 1052, CAST(N'2027-08-24T13:00:00.000' AS DateTime), CAST(N'2027-08-24T13:30:00.000' AS DateTime), N'Pendiente', N'CONSULTA CONTROL INTEGRAL', N'Prueba de horarios de Yanina.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2056, 18, 3, CAST(N'2027-11-29T12:00:00.000' AS DateTime), CAST(N'2027-11-29T12:30:00.000' AS DateTime), N'Pendiente', N'TEST AUTOMATIZADO PLAYWRIGHT', N'Generado automáticamente para verificar flujo de Administrativo.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2057, 1040, 1054, CAST(N'2027-12-21T13:00:00.000' AS DateTime), CAST(N'2027-12-21T13:30:00.000' AS DateTime), N'Pendiente', N'CONSULTA CONTROL INTEGRAL', N'Prueba de horarios de Yanina.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2058, 18, 3, CAST(N'2027-11-29T18:30:00.000' AS DateTime), CAST(N'2027-11-29T19:00:00.000' AS DateTime), N'Pendiente', N'TEST AUTOMATIZADO PLAYWRIGHT', N'Generado automáticamente para verificar flujo de Administrativo.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2059, 1041, 1056, CAST(N'2027-12-14T13:00:00.000' AS DateTime), CAST(N'2027-12-14T13:30:00.000' AS DateTime), N'Pendiente', N'CONSULTA CONTROL INTEGRAL', N'Prueba de horarios de Yanina.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2060, 18, 3, CAST(N'2027-04-05T12:15:00.000' AS DateTime), CAST(N'2027-04-05T12:45:00.000' AS DateTime), N'Pendiente', N'TEST AUTOMATIZADO PLAYWRIGHT', N'Generado automáticamente para verificar flujo de Administrativo.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2061, 1042, 1058, CAST(N'2027-09-21T13:00:00.000' AS DateTime), CAST(N'2027-09-21T13:30:00.000' AS DateTime), N'Pendiente', N'CONSULTA CONTROL INTEGRAL', N'Prueba de horarios de Yanina.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2062, 22, 1017, CAST(N'2026-05-23T09:30:00.000' AS DateTime), CAST(N'2026-05-23T10:30:00.000' AS DateTime), N'Pendiente', N'dsvdsfdsf', N'dsfdsfdsfesf', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2063, 19, 1017, CAST(N'2026-05-24T07:45:00.000' AS DateTime), CAST(N'2026-05-24T08:15:00.000' AS DateTime), N'Pendiente', N'awdwad', N'awdwada', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2064, 18, 3, CAST(N'2027-10-11T13:45:00.000' AS DateTime), CAST(N'2027-10-11T14:15:00.000' AS DateTime), N'Pendiente', N'TEST AUTOMATIZADO PLAYWRIGHT', N'Generado automáticamente para verificar flujo de Administrativo.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2065, 1043, 1060, CAST(N'2027-11-30T13:00:00.000' AS DateTime), CAST(N'2027-11-30T13:30:00.000' AS DateTime), N'Pendiente', N'CONSULTA CONTROL INTEGRAL', N'Prueba de horarios de Yanina.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2066, 18, 3, CAST(N'2027-12-13T18:45:00.000' AS DateTime), CAST(N'2027-12-13T19:15:00.000' AS DateTime), N'Pendiente', N'TEST AUTOMATIZADO PLAYWRIGHT', N'Generado automáticamente para verificar flujo de Administrativo.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2067, 1044, 1062, CAST(N'2027-10-05T13:00:00.000' AS DateTime), CAST(N'2027-10-05T13:30:00.000' AS DateTime), N'Pendiente', N'CONSULTA CONTROL INTEGRAL', N'Prueba de horarios de Yanina.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2068, 18, 3, CAST(N'2027-02-08T13:45:00.000' AS DateTime), CAST(N'2027-02-08T14:15:00.000' AS DateTime), N'Pendiente', N'TEST AUTOMATIZADO PLAYWRIGHT', N'Generado automáticamente para verificar flujo de Administrativo.', NULL, NULL, NULL, 0)
INSERT [dbo].[turnos] ([id], [profesional_id], [paciente_id], [fecha_hora_inicio], [fecha_hora_fin], [estado], [motivo_consulta], [observaciones_admin], [monto_abonado], [metodo_pago], [fecha_pago], [recordatorio_enviado]) VALUES (2069, 1045, 1064, CAST(N'2027-11-23T16:00:00.000' AS DateTime), CAST(N'2027-11-23T16:30:00.000' AS DateTime), N'Completado', N'CONSULTA CONTROL INTEGRAL', N'Prueba de horarios de Yanina.', NULL, NULL, NULL, 0)
SET IDENTITY_INSERT [dbo].[turnos] OFF
GO
SET IDENTITY_INSERT [dbo].[usuarios] ON 

INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1, N'doctor@test.com', N'claveSecreta123', 5, 1, CAST(N'2025-12-17T19:47:54.367' AS DateTime), N'doctor_nico', NULL)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (4, N'admin@medicapp.com', N'clave_super_secreta_123', 2, 1, CAST(N'2026-01-21T20:08:24.167' AS DateTime), N'admin_general', 0)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (6, N'yanina@gmail.com', N'123456', 4, 1, CAST(N'2026-02-21T20:30:53.907' AS DateTime), N'Yanina', 0)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (9, N'jboca@medicapp.local', N'22345555', 2, 1, CAST(N'2026-02-28T01:49:56.707' AS DateTime), N'jboca', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (10, N'melanie@gmail.com', N'12345', 4, 1, CAST(N'2026-02-28T15:12:23.983' AS DateTime), N'mmigliarino', 0)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (11, N'ctorres@medicapp.local', N'40555777', 2, 1, CAST(N'2026-02-28T17:32:37.803' AS DateTime), N'ctorres', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (12, N'cfalcioni@medicapp.local', N'23456432', 2, 1, CAST(N'2026-03-01T23:14:18.307' AS DateTime), N'cfalcioni', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (16, N'jmorales@medicapp.local', N'37546781', 2, 1, CAST(N'2026-03-01T23:18:52.207' AS DateTime), N'jmorales', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1012, N'msmith@medicapp.local', N'34567321', 2, 1, CAST(N'2026-03-14T19:01:24.750' AS DateTime), N'msmith', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1014, N'dflow@medicapp.local', N'77145807', 2, 1, CAST(N'2026-05-20T00:17:55.673' AS DateTime), N'dflow', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1015, N'dflow1@medicapp.local', N'60503625', 2, 1, CAST(N'2026-05-20T00:18:43.053' AS DateTime), N'dflow1', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1016, N'dflow2@medicapp.local', N'30764267', 2, 1, CAST(N'2026-05-20T00:19:45.897' AS DateTime), N'dflow2', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1017, N'dflow3@medicapp.local', N'44515348', 2, 1, CAST(N'2026-05-20T00:20:22.610' AS DateTime), N'dflow3', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1018, N'dflow4@medicapp.local', N'71374767', 2, 1, CAST(N'2026-05-20T13:07:40.237' AS DateTime), N'dflow4', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1019, N'dflow5@medicapp.local', N'93303952', 2, 1, CAST(N'2026-05-20T13:08:40.660' AS DateTime), N'dflow5', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1020, N'dflow6@medicapp.local', N'74873088', 2, 1, CAST(N'2026-05-20T13:13:15.187' AS DateTime), N'dflow6', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1021, N'dflow7@medicapp.local', N'52365662', 2, 1, CAST(N'2026-05-20T17:51:54.937' AS DateTime), N'dflow7', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1022, N'dflow8@medicapp.local', N'23652242', 2, 1, CAST(N'2026-05-20T18:06:44.780' AS DateTime), N'dflow8', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1023, N'dflow9@medicapp.local', N'45149489', 2, 1, CAST(N'2026-05-20T18:32:28.053' AS DateTime), N'dflow9', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1024, N'mlamas@medicapp.local', N'33754234', 2, 1, CAST(N'2026-05-21T00:05:33.160' AS DateTime), N'mlamas', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1025, N'dflow10@medicapp.local', N'53818162', 2, 1, CAST(N'2026-05-21T19:34:32.433' AS DateTime), N'dflow10', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1026, N'dflow11@medicapp.local', N'91676544', 2, 1, CAST(N'2026-05-21T19:43:56.033' AS DateTime), N'dflow11', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1027, N'dflow12@medicapp.local', N'60799863', 2, 1, CAST(N'2026-05-21T19:49:52.940' AS DateTime), N'dflow12', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1028, N'dflow13@medicapp.local', N'74975059', 2, 1, CAST(N'2026-05-21T20:06:54.370' AS DateTime), N'dflow13', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1029, N'dflow14@medicapp.local', N'82801432', 2, 1, CAST(N'2026-05-21T20:07:23.300' AS DateTime), N'dflow14', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1030, N'dflow15@medicapp.local', N'44509520', 2, 1, CAST(N'2026-05-21T20:12:54.290' AS DateTime), N'dflow15', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1031, N'dflow16@medicapp.local', N'73921120', 2, 1, CAST(N'2026-05-21T20:23:14.100' AS DateTime), N'dflow16', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1032, N'dflow17@medicapp.local', N'44415597', 2, 1, CAST(N'2026-05-22T11:50:52.240' AS DateTime), N'dflow17', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1033, N'dflow18@medicapp.local', N'38466580', 2, 1, CAST(N'2026-05-22T11:55:06.880' AS DateTime), N'dflow18', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1034, N'dflow19@medicapp.local', N'70944579', 2, 1, CAST(N'2026-05-23T02:59:45.567' AS DateTime), N'dflow19', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1035, N'dflow20@medicapp.local', N'17526302', 2, 1, CAST(N'2026-05-28T01:01:43.820' AS DateTime), N'dflow20', 1)
INSERT [dbo].[usuarios] ([id], [email], [password_hash], [rol_id], [activo], [fecha_creacion], [username], [debe_cambiar_pass]) VALUES (1036, N'dflow21@medicapp.local', N'32458461', 2, 1, CAST(N'2026-05-28T01:08:39.917' AS DateTime), N'dflow21', 1)
SET IDENTITY_INSERT [dbo].[usuarios] OFF
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__obras_so__72AFBCC6DEFB503D]    Script Date: 28/5/2026 01:11:33 ******/
ALTER TABLE [dbo].[obras_sociales] ADD UNIQUE NONCLUSTERED 
(
	[nombre] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__paciente__D87608A7698E780A]    Script Date: 28/5/2026 01:11:33 ******/
ALTER TABLE [dbo].[pacientes] ADD  CONSTRAINT [UQ__paciente__D87608A7698E780A] UNIQUE NONCLUSTERED 
(
	[dni] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_Matricula]    Script Date: 28/5/2026 01:11:33 ******/
ALTER TABLE [dbo].[profesionales] ADD  CONSTRAINT [UQ_Matricula] UNIQUE NONCLUSTERED 
(
	[matricula] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__roles__40F9A206F05FED53]    Script Date: 28/5/2026 01:11:33 ******/
ALTER TABLE [dbo].[roles] ADD UNIQUE NONCLUSTERED 
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__roles__72AFBCC67352BDA0]    Script Date: 28/5/2026 01:11:33 ******/
ALTER TABLE [dbo].[roles] ADD UNIQUE NONCLUSTERED 
(
	[nombre] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__usuarios__AB6E6164ACF9BC60]    Script Date: 28/5/2026 01:11:33 ******/
ALTER TABLE [dbo].[usuarios] ADD UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__usuarios__F3DBC572FDE428C6]    Script Date: 28/5/2026 01:11:33 ******/
ALTER TABLE [dbo].[usuarios] ADD UNIQUE NONCLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[archivos_medicos] ADD  DEFAULT (getdate()) FOR [fecha_subida]
GO
ALTER TABLE [dbo].[caja_diaria] ADD  DEFAULT (getdate()) FOR [fecha]
GO
ALTER TABLE [dbo].[caja_diaria] ADD  DEFAULT ((0.00)) FOR [monto_apertura]
GO
ALTER TABLE [dbo].[caja_diaria] ADD  DEFAULT ('Abierta') FOR [estado]
GO
ALTER TABLE [dbo].[caja_diaria] ADD  DEFAULT (getdate()) FOR [fecha_apertura]
GO
ALTER TABLE [dbo].[historial_clinico] ADD  DEFAULT (getdate()) FOR [fecha_registro]
GO
ALTER TABLE [dbo].[obras_sociales] ADD  DEFAULT ((1)) FOR [activo]
GO
ALTER TABLE [dbo].[pacientes] ADD  CONSTRAINT [DF__pacientes__fecha__5BE2A6F2]  DEFAULT (getdate()) FOR [fecha_alta]
GO
ALTER TABLE [dbo].[pagos] ADD  DEFAULT (getdate()) FOR [fecha_pago]
GO
ALTER TABLE [dbo].[profesionales] ADD  DEFAULT ((30)) FOR [duracion_turno_promedio]
GO
ALTER TABLE [dbo].[profesionales] ADD  DEFAULT ((20.00)) FOR [porcentaje_retencion]
GO
ALTER TABLE [dbo].[turnos] ADD  DEFAULT ('PENDIENTE') FOR [estado]
GO
ALTER TABLE [dbo].[turnos] ADD  DEFAULT ((0)) FOR [recordatorio_enviado]
GO
ALTER TABLE [dbo].[usuarios] ADD  DEFAULT ((1)) FOR [activo]
GO
ALTER TABLE [dbo].[usuarios] ADD  DEFAULT (getdate()) FOR [fecha_creacion]
GO
ALTER TABLE [dbo].[usuarios] ADD  DEFAULT ((1)) FOR [debe_cambiar_pass]
GO
ALTER TABLE [dbo].[administrativos]  WITH CHECK ADD FOREIGN KEY([usuario_id])
REFERENCES [dbo].[usuarios] ([id])
GO
ALTER TABLE [dbo].[archivos_medicos]  WITH CHECK ADD  CONSTRAINT [FK_Archivos_Pacientes] FOREIGN KEY([paciente_id])
REFERENCES [dbo].[pacientes] ([id])
GO
ALTER TABLE [dbo].[archivos_medicos] CHECK CONSTRAINT [FK_Archivos_Pacientes]
GO
ALTER TABLE [dbo].[archivos_medicos]  WITH CHECK ADD  CONSTRAINT [FK_Archivos_Turnos] FOREIGN KEY([turno_id])
REFERENCES [dbo].[turnos] ([id])
GO
ALTER TABLE [dbo].[archivos_medicos] CHECK CONSTRAINT [FK_Archivos_Turnos]
GO
ALTER TABLE [dbo].[historial_clinico]  WITH CHECK ADD FOREIGN KEY([profesional_id])
REFERENCES [dbo].[profesionales] ([id])
GO
ALTER TABLE [dbo].[historial_clinico]  WITH CHECK ADD  CONSTRAINT [FK__historial__pacie__656C112C] FOREIGN KEY([paciente_id])
REFERENCES [dbo].[pacientes] ([id])
GO
ALTER TABLE [dbo].[historial_clinico] CHECK CONSTRAINT [FK__historial__pacie__656C112C]
GO
ALTER TABLE [dbo].[historial_clinico]  WITH CHECK ADD FOREIGN KEY([turno_id])
REFERENCES [dbo].[turnos] ([id])
GO
ALTER TABLE [dbo].[horarios_profesional]  WITH CHECK ADD  CONSTRAINT [FK_Horarios_Profesional] FOREIGN KEY([profesional_id])
REFERENCES [dbo].[profesionales] ([id])
GO
ALTER TABLE [dbo].[horarios_profesional] CHECK CONSTRAINT [FK_Horarios_Profesional]
GO
ALTER TABLE [dbo].[pacientes]  WITH CHECK ADD  CONSTRAINT [FK_Pacientes_ObrasSociales] FOREIGN KEY([obra_social_id])
REFERENCES [dbo].[obras_sociales] ([id])
GO
ALTER TABLE [dbo].[pacientes] CHECK CONSTRAINT [FK_Pacientes_ObrasSociales]
GO
ALTER TABLE [dbo].[pagos]  WITH CHECK ADD FOREIGN KEY([caja_diaria_id])
REFERENCES [dbo].[caja_diaria] ([id])
GO
ALTER TABLE [dbo].[pagos]  WITH CHECK ADD FOREIGN KEY([turno_id])
REFERENCES [dbo].[turnos] ([id])
GO
ALTER TABLE [dbo].[Permisos_Historial]  WITH CHECK ADD FOREIGN KEY([historial_id])
REFERENCES [dbo].[historial_clinico] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Permisos_Historial]  WITH CHECK ADD FOREIGN KEY([profesional_invitado_id])
REFERENCES [dbo].[profesionales] ([id])
GO
ALTER TABLE [dbo].[profesionales]  WITH CHECK ADD FOREIGN KEY([usuario_id])
REFERENCES [dbo].[usuarios] ([id])
GO
ALTER TABLE [dbo].[turnos]  WITH CHECK ADD FOREIGN KEY([profesional_id])
REFERENCES [dbo].[profesionales] ([id])
GO
ALTER TABLE [dbo].[turnos]  WITH CHECK ADD  CONSTRAINT [FK__turnos__paciente__60A75C0F] FOREIGN KEY([paciente_id])
REFERENCES [dbo].[pacientes] ([id])
GO
ALTER TABLE [dbo].[turnos] CHECK CONSTRAINT [FK__turnos__paciente__60A75C0F]
GO
ALTER TABLE [dbo].[usuarios]  WITH CHECK ADD FOREIGN KEY([rol_id])
REFERENCES [dbo].[roles] ([id])
GO
ALTER TABLE [dbo].[turnos]  WITH CHECK ADD  CONSTRAINT [CK_Turnos_Estado] CHECK  (([estado]='Cancelado' OR [estado]='Completado' OR [estado]='Confirmado' OR [estado]='Pendiente'))
GO
ALTER TABLE [dbo].[turnos] CHECK CONSTRAINT [CK_Turnos_Estado]
GO
/****** Object:  StoredProcedure [dbo].[sp_AbrirCaja]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_AbrirCaja]
    @usuario_id INT,
    @monto_apertura DECIMAL(10,2) = 0.00 -- 💡 Por defecto es $0 si la secretaria no maneja efectivo físico hoy
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validar si ya hay una caja abierta para el día de hoy
    IF EXISTS (SELECT 1 FROM dbo.caja_diaria WHERE estado = 'Abierta' AND fecha = CAST(GETDATE() AS DATE))
    BEGIN
        RAISERROR ('Ya existe una sesión de caja abierta para el día de hoy.', 16, 1);
        RETURN;
    END

    INSERT INTO dbo.caja_diaria (fecha, monto_apertura, estado, usuario_apertura_id, fecha_apertura)
    VALUES (CAST(GETDATE() AS DATE), @monto_apertura, 'Abierta', @usuario_id, GETDATE());

    SELECT SCOPE_IDENTITY() AS caja_diaria_id, 'Caja abierta correctamente' AS mensaje;
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_CerrarCaja]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_CerrarCaja]
    @caja_diaria_id INT,
    @usuario_cierre_id INT,
    @monto_cierre_real DECIMAL(10,2) -- Dinero físico real contado en el cajón por la secretaria
AS
BEGIN
    SET NOCOUNT ON;

    -- Verificar que la caja exista y esté abierta
    IF NOT EXISTS (SELECT 1 FROM dbo.caja_diaria WHERE id = @caja_diaria_id AND estado = 'Abierta')
    BEGIN
        RAISERROR ('La sesión de caja seleccionada no existe o ya se encuentra cerrada.', 16, 1);
        RETURN;
    END

    -- 🧮 Calcular la suma esperada: Saldo apertura + todos los pagos cobrados en Efectivo durante el día
    DECLARE @monto_apertura DECIMAL(10,2);
    DECLARE @total_efectivo_cobrado DECIMAL(10,2);
    DECLARE @monto_cierre_esperado DECIMAL(10,2);
    DECLARE @diferencia DECIMAL(10,2);

    SELECT @monto_apertura = monto_apertura FROM dbo.caja_diaria WHERE id = @caja_diaria_id;

    -- Solo sumamos pagos con método 'Efectivo', ya que las tarjetas y MercadoPago no entran al cajón físico
    SELECT @total_efectivo_cobrado = ISNULL(SUM(monto_bruto), 0.00)
    FROM dbo.pagos
    WHERE caja_diaria_id = @caja_diaria_id AND metodo_pago = 'Efectivo';

    SET @monto_cierre_esperado = @monto_apertura + @total_efectivo_cobrado;
    SET @diferencia = @monto_cierre_real - @monto_cierre_esperado;

    -- Actualizar los campos e inhabilitar la caja (Cierre definitivo)
    UPDATE dbo.caja_diaria
    SET monto_cierre_esperado = @monto_cierre_esperado,
        monto_cierre_real = @monto_cierre_real,
        diferencia = @diferencia,
        estado = 'Cerrada',
        usuario_cierre_id = @usuario_cierre_id,
        fecha_cierre = GETDATE()
    WHERE id = @caja_diaria_id;

    -- Devolver balance de cierre para la interfaz del usuario
    SELECT 
        @caja_diaria_id AS caja_diaria_id,
        @monto_apertura AS monto_apertura,
        @total_efectivo_cobrado AS total_efectivo_cobrado,
        @monto_cierre_esperado AS monto_cierre_esperado,
        @monto_cierre_real AS monto_cierre_real,
        @diferencia AS diferencia,
        CASE 
            WHEN @diferencia = 0 THEN '✔️ Caja Cuadrada Perfectamente'
            WHEN @diferencia > 0 THEN '🚨 Sobrante en Caja'
            ELSE '🚨 Faltante en Caja'
        END AS diagnostico;
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_ChangePassword]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_ChangePassword]
    @id INT,
    @newPassword NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- TRUCO: Quitamos espacios en blanco al principio y final
    -- para no dejar que los usuarios "hagan trampa" enviando "  MiPassword  "
    DECLARE @cleanPassword NVARCHAR(255) = LTRIM(RTRIM(@newPassword));
    
    -- Validamos que la nueva contraseña limpia no sea igual a la actual
    IF EXISTS (SELECT 1 FROM Usuarios WHERE id = @id AND password_hash = @cleanPassword)
    BEGIN
        -- SQL Server interrumpe la transacción y envía este error al Frontend
        THROW 51000, 'Error: La nueva contraseña no puede ser igual a la anterior.', 1;
        RETURN;
    END
    
    UPDATE Usuarios 
    SET password_hash = @cleanPassword, debe_cambiar_pass = 0
    WHERE id = @id;
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_CreateAdministrativo]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_CreateAdministrativo]
	@usuario_id		int,
	@nombre			varchar(20),
	@apellido		varchar(20)

AS
BEGIN
	IF EXISTS (SELECT * FROM administrativos WHERE usuario_id = @usuario_id)
				-- Si existe, lanzamos un error personalizado
        THROW 51000, 'El AdministrativoId ya existe en la base de datos', 1;
	
END
	INSERT INTO administrativos 
	(
	usuario_id,
	nombre,
	apellido
	)
	VALUES
	(
	@usuario_id,
	@nombre,
	@apellido
	)

GO
/****** Object:  StoredProcedure [dbo].[sp_CreateHistorialClinico]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_CreateHistorialClinico]
@paciente_id INT,
    @usuario_id INT, -- ¡Ahora recibe el ID del usuario logueado!
    @turno_id INT = NULL,
    @motivo NVARCHAR(255) = NULL,
    @evolucion NVARCHAR(MAX),
    @diagnostico NVARCHAR(255) = NULL,
    @tratamiento NVARCHAR(MAX) = NULL,
    @archivos_adjuntos_url NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Variable para guardar el ID real del profesional
    DECLARE @profesional_id INT;
    
    -- Buscamos el ID del profesional asignado a este usuario
    SELECT @profesional_id = id FROM profesionales WHERE usuario_id = @usuario_id;

    -- Si no existe, bloqueamos con un error personalizado
    IF @profesional_id IS NULL
    BEGIN
        THROW 51005, 'Error: Este usuario no tiene un perfil de médico asociado para firmar evoluciones.', 1;
    END

    -- Insertamos usando el ID de profesional real
    INSERT INTO historial_clinico (
        paciente_id,
        profesional_id, 
        turno_id,
        fecha_registro,
        motivo,
        evolucion,
        diagnostico,
        tratamiento,
        archivos_adjuntos_url
    )
    VALUES (
        @paciente_id,
        @profesional_id,
        @turno_id,
        GETDATE(),
        @motivo,
        @evolucion,
        @diagnostico,
        @tratamiento,
        @archivos_adjuntos_url
    );
END

GO
/****** Object:  StoredProcedure [dbo].[sp_CreatePaciente]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

        CREATE PROCEDURE [dbo].[sp_CreatePaciente]
            @nombre				varchar(50),
            @apellido			varchar(50),
            @dni				varchar(15),
            @telefono			varchar(20),
            @email				varchar(20),
            @fecha_nacimiento	date,
            @obra_social_id		INT = NULL,
            @numero_afiliado	varchar(20),
            @fecha_alta			varchar(20),
            @sexo               nvarchar(50) = NULL,
            @grupo_sanguineo    nvarchar(20) = NULL,
            @direccion          nvarchar(255) = NULL,
            @contacto_emergencia nvarchar(255) = NULL,
            @alergias           nvarchar(1000) = NULL
        AS
        BEGIN
            SET NOCOUNT ON;

            IF EXISTS (SELECT * FROM pacientes where dni = @dni)
            BEGIN
                -- Si existe, lanzamos un error personalizado
                THROW 51000, 'El DNI ya existe en la base de datos', 1;
            END

            INSERT INTO pacientes 
            (
                nombre,	
                apellido,		
                dni,			
                telefono,		
                email,			
                fecha_nacimiento,
                obra_social,	-- legacy mapping
                obra_social_id,
                numero_afiliado,
                fecha_alta,
                sexo,
                grupo_sanguineo,
                direccion,
                contacto_emergencia,
                alergias
            )
            VALUES 
            (
                @nombre,				
                @apellido,			
                @dni,				
                @telefono,			
                @email,				
                @fecha_nacimiento,	
                CAST(@obra_social_id AS VARCHAR(100)),
                @obra_social_id,
                @numero_afiliado,
                @fecha_alta,
                @sexo,
                @grupo_sanguineo,
                @direccion,
                @contacto_emergencia,
                @alergias
            );
        END
    
GO
/****** Object:  StoredProcedure [dbo].[sp_CreateProfesional]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

        CREATE PROCEDURE [dbo].[sp_CreateProfesional]
            @Nombre NVARCHAR(100),
            @Apellido NVARCHAR(100),
            @DNI NVARCHAR(20),       
            @Matricula NVARCHAR(50),
            @Especialidad NVARCHAR(100),
            @Telefono NVARCHAR(50),
            @duracionTurnoPromedio INT,
            @RolID INT = 2,
            @HorariosJSON NVARCHAR(MAX) = NULL,
            @PorcentajeRetencion DECIMAL(5,2) = 20.00,
            @TipoMatricula NVARCHAR(20) = NULL,
            @CuitCuil NVARCHAR(20) = NULL
        AS
        BEGIN
            SET NOCOUNT ON;
            
            BEGIN TRY
                BEGIN TRANSACTION;

                DECLARE @NuevoUsuarioID INT;
                DECLARE @NuevoProfesionalID INT; 
                DECLARE @UsuarioBase VARCHAR(50);
                DECLARE @UsuarioFinal VARCHAR(50);
                DECLARE @Contador INT = 0;
                DECLARE @PasswordProvisoria NVARCHAR(255);
                DECLARE @EmailGenerado NVARCHAR(100); 

                -- Lógica para generar usuario único
                SET @UsuarioBase = LOWER(SUBSTRING(@Nombre, 1, 1) + @Apellido);
                SET @UsuarioFinal = @UsuarioBase;

                -- Loop para encontrar un usuario libre
                WHILE EXISTS (SELECT 1 FROM dbo.usuarios WHERE username = @UsuarioFinal)
                BEGIN
                    SET @Contador = @Contador + 1;
                    SET @UsuarioFinal = @UsuarioBase + CAST(@Contador AS VARCHAR(5));
                END

                -- Generamos un email ficticio y password temporal
                SET @EmailGenerado = @UsuarioFinal + '@medicapp.local';
                SET @PasswordProvisoria = @DNI; 

                -- 1. Insertamos en la tabla PADRE (Usuarios)
                INSERT INTO dbo.usuarios (email, password_hash, rol_id, activo, fecha_creacion, username, debe_cambiar_pass)
                VALUES (@EmailGenerado, @PasswordProvisoria, @RolID, 1, GETDATE(), @UsuarioFinal, 1);

                -- Recuperamos el ID del usuario
                SET @NuevoUsuarioID = SCOPE_IDENTITY();

                -- 2. Insertamos en la tabla HIJA (Profesionales) con porcentaje_retencion, tipo_matricula, cuit_cuil
                INSERT INTO dbo.profesionales(usuario_id, nombre, apellido, matricula, especialidad, telefono, duracion_turno_promedio, porcentaje_retencion, tipo_matricula, cuit_cuil)
                VALUES (@NuevoUsuarioID, @Nombre, @Apellido, @Matricula, @Especialidad, @Telefono, @duracionTurnoPromedio, @PorcentajeRetencion, @TipoMatricula, @CuitCuil);

                -- Recuperamos el ID del PROFESIONAL recién creado
                SET @NuevoProfesionalID = SCOPE_IDENTITY();

                -- 3. Lógica para insertar horarios (Opcional)
                IF @HorariosJSON IS NOT NULL AND ISJSON(@HorariosJSON) = 1
                BEGIN
                    INSERT INTO dbo.horarios_profesional (profesional_id, dia_semana, hora_inicio, hora_fin)
                    SELECT 
                        @NuevoProfesionalID, 
                        dia_semana, 
                        hora_inicio, 
                        hora_fin
                    FROM OPENJSON(@HorariosJSON)
                    WITH (
                        dia_semana VARCHAR(20) '$.dia_semana',
                        hora_inicio TIME '$.hora_inicio',
                        hora_fin TIME '$.hora_fin'
                    );
                END

                -- Confirmamos la transacción
                COMMIT TRANSACTION;

                -- Devolvemos los datos al backend
                SELECT 
                    @NuevoUsuarioID as ID,
                    @UsuarioFinal as UsuarioGenerado,
                    @PasswordProvisoria as PasswordTemporal,
                    @EmailGenerado as EmailDestino,
                    'Medico creado exitosamente' as Mensaje;

            END TRY
            BEGIN CATCH
                -- Si algo falla, deshacemos todo
                IF @@TRANCOUNT > 0
                    ROLLBACK TRANSACTION;
                    
                -- Lanzamos el error hacia Node.js
                THROW; 
            END CATCH
        END
    
GO
/****** Object:  StoredProcedure [dbo].[sp_CreateRol]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Migliarino Nicolas
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_CreateRol]

@nombre varchar(30),
@codigo varchar(20)


AS
BEGIN

INSERT INTO roles 
(
nombre,
codigo
)
VALUES
(
@nombre,
@codigo
)

	SET NOCOUNT ON;

END
GO
/****** Object:  StoredProcedure [dbo].[sp_CreateTurno]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_CreateTurno] 
   @profesional_id      int,
   @paciente_id         int,
   @fecha_hora_inicio   datetime,
   @fecha_hora_fin      datetime,
   @estado              varchar (20),
   @motivo_consulta     nvarchar (300),
   @observaciones_admin nvarchar (300)
AS
BEGIN
    SET NOCOUNT ON;

    -- 👇 NUEVO: Validar que no sea en el pasado
    IF @fecha_hora_inicio < GETDATE()
    BEGIN
        THROW 51004, 'Error: No se puede agendar un turno en una fecha u hora que ya pasó.', 1;
    END

    -- Validar orden de fechas básico
    IF @fecha_hora_fin <= @fecha_hora_inicio
    BEGIN
        THROW 51001, 'Error: La fecha y hora de fin debe ser posterior al inicio.', 1;
    END

    -- Buscamos si existe un turno que se cruce
    IF EXISTS (
        SELECT 1 FROM Turnos
        WHERE profesional_id = @profesional_id
          AND estado != 'Cancelado'
          AND @fecha_hora_inicio < fecha_hora_fin 
          AND @fecha_hora_fin > fecha_hora_inicio
    )
    BEGIN
        THROW 51003, 'Error: El profesional ya tiene un turno ocupado en ese horario.', 1;
    END

    -- Guardamos el turno
    INSERT INTO turnos (profesional_id, paciente_id, fecha_hora_inicio, fecha_hora_fin, estado, motivo_consulta, observaciones_admin)
    VALUES (@profesional_id, @paciente_id, @fecha_hora_inicio, @fecha_hora_fin, @estado, @motivo_consulta, @observaciones_admin);
END
GO
/****** Object:  StoredProcedure [dbo].[sp_CreateUsuario]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_CreateUsuario] 
	@email				varchar(25),
	@password_hash		nvarchar (20),
	@rol_id				int,
	@activo				bit,
	@fecha_creacion		datetime,
	@username			varchar (50),
	@debe_cambiar_pass	bit
AS
BEGIN
    SET NOCOUNT ON;

	-- Validamos que el nombre de usuario o el email no estén repetidos
	IF EXISTS (SELECT 1 FROM usuarios WHERE email = @email OR username = @username)
    BEGIN
		THROW 51000, 'Error: El Email o Nombre de Usuario ya existen en la base de datos.', 1;
    END

    -- Insertamos el nuevo usuario (sin el ID, SQL lo genera solo con IDENTITY)
	INSERT INTO usuarios 
	(
		email,				
		password_hash,		
		rol_id,				
		activo,			
		fecha_creacion,		
		username,			
		debe_cambiar_pass
	)
	VALUES
	(
		@email,				
		@password_hash,		
		@rol_id,				
		@activo,			
		@fecha_creacion,		
		@username,			
		@debe_cambiar_pass
	);
END
GO
/****** Object:  StoredProcedure [dbo].[sp_DeleteAdministrativo]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_DeleteAdministrativo]
    @id INT
AS
BEGIN
    DELETE FROM Administrativos WHERE id = @id;
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_DeleteHistorialClinico]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- 4. ELIMINAR HISTORIAL
CREATE PROCEDURE [dbo].[sp_DeleteHistorialClinico]
    @id INT
AS
BEGIN
    DELETE FROM historial_clinico WHERE id = @id;
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_DeletePaciente]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_DeletePaciente]
    @id INT
AS
BEGIN
    DELETE FROM Pacientes WHERE id = @id;
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_DeleteProfesional]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_DeleteProfesional]
    @id INT
AS
BEGIN
    DELETE FROM profesionales WHERE id = @id;
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_DeleteRol]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_DeleteRol]
    @id INT
AS
BEGIN
    DELETE FROM Roles WHERE id = @id;
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_DeleteTurno]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_DeleteTurno]
    @id INT
AS
BEGIN
    DELETE FROM Turnos WHERE id = @id;
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_DeleteUsuario]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_DeleteUsuario]
    @id INT
AS
BEGIN
    DELETE FROM Usuarios WHERE id = @id;
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_GetAdministrativos]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetAdministrativos]
AS
BEGIN
    SELECT * FROM Administrativos;
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_GetArchivosPaciente]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetArchivosPaciente]
    @paciente_id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM dbo.archivos_medicos 
    WHERE paciente_id = @paciente_id 
    ORDER BY fecha_subida DESC;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetHistorialesClinicos]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetHistorialesClinicos]
    @paciente_id INT,
    @usuario_id INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @profesional_id INT;
    SELECT @profesional_id = id FROM profesionales WHERE usuario_id = @usuario_id;

    -- Usamos EXISTS en lugar de DISTINCT + JOIN (¡Evita el error de NVARCHAR(MAX)!)
    SELECT h.*,
           CAST(CASE WHEN h.profesional_id = @profesional_id THEN 1 ELSE 0 END AS BIT) AS es_autor
    FROM historial_clinico h
    WHERE h.paciente_id = @paciente_id 
      AND (
          h.profesional_id = @profesional_id 
          OR EXISTS (
              SELECT 1 FROM Permisos_Historial perm 
              WHERE perm.historial_id = h.id AND perm.profesional_invitado_id = @profesional_id
          )
      )
    ORDER BY h.fecha_registro DESC;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetHorarios]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 2. Creamos el SP para que el Backend pueda leer estos horarios fácilmente
CREATE PROCEDURE [dbo].[sp_GetHorarios]
AS
BEGIN
    SET NOCOUNT ON;
    -- Formateamos la hora para que React la entienda fácil (ej: "09:00")
    SELECT id, profesional_id, dia_semana, 
           CONVERT(VARCHAR(5), hora_inicio, 108) AS hora_inicio, 
           CONVERT(VARCHAR(5), hora_fin, 108) AS hora_fin
    FROM dbo.horarios_profesional;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetLiquidacionProfesional]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_GetLiquidacionProfesional]
    @profesional_id INT,
    @fecha_desde DATE,
    @fecha_hasta DATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Retornar el listado analítico de turnos cobrados
    SELECT 
        p.id AS pago_id,
        p.turno_id,
        t.fecha_hora_inicio AS fecha_consulta,
        pac.nombre + ' ' + pac.apellido AS paciente_nombre,
        p.monto_bruto,
        p.porcentaje_retencion,
        p.monto_retencion_clinica AS retencion_clinica,
        p.monto_neto_medico AS honorarios_medico,
        p.metodo_pago,
        p.fecha_pago
    FROM dbo.pagos p
    INNER JOIN dbo.turnos t ON p.turno_id = t.id
    INNER JOIN dbo.pacientes pac ON t.paciente_id = pac.id
    WHERE t.profesional_id = @profesional_id 
      AND CAST(p.fecha_pago AS DATE) BETWEEN @fecha_desde AND @fecha_hasta
    ORDER BY p.fecha_pago ASC;

    -- Retornar el consolidado acumulado para el panel principal
    SELECT 
        prof.id AS profesional_id,
        prof.nombre + ' ' + prof.apellido AS profesional_nombre,
        prof.especialidad,
        COUNT(p.id) AS cantidad_consultas,
        SUM(p.monto_bruto) AS total_recaudado_bruto,
        SUM(p.monto_retencion_clinica) AS total_comision_clinica,
        SUM(p.monto_neto_medico) AS total_honorarios_medico
    FROM dbo.pagos p
    INNER JOIN dbo.turnos t ON p.turno_id = t.id
    INNER JOIN dbo.profesionales prof ON t.profesional_id = prof.id
    WHERE prof.id = @profesional_id 
      AND CAST(p.fecha_pago AS DATE) BETWEEN @fecha_desde AND @fecha_hasta
    GROUP BY prof.id, prof.nombre, prof.apellido, prof.especialidad;

END;
GO
/****** Object:  StoredProcedure [dbo].[sp_GetObrasSociales]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetObrasSociales]
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Traemos las activas. 
    -- El CASE de abajo es un truco para que "Particular" salga siempre primera en la lista, y el resto alfabéticamente.
    SELECT id, nombre 
    FROM dbo.obras_sociales 
    WHERE activo = 1
    ORDER BY 
        CASE WHEN nombre = 'Particular (Sin Obra Social)' THEN 0 ELSE 1 END, 
        nombre ASC;
END

GO
/****** Object:  StoredProcedure [dbo].[sp_GetPaciente]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetPaciente]
    @id INT
AS
BEGIN
    SELECT * FROM Pacientes WHERE id = @id;
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_GetPacientes]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- 1. OBTENER LISTA DE PACIENTES
CREATE PROCEDURE [dbo].[sp_GetPacientes]

  @usuario_id INT = NULL -- Añadimos este parámetro opcional
AS
BEGIN
    SET NOCOUNT ON;
    -- Si se pasa un usuario_id y este pertenece a un médico, filtramos
    IF @usuario_id IS NOT NULL AND EXISTS (SELECT 1 FROM profesionales WHERE usuario_id = @usuario_id)
    BEGIN
        DECLARE @profesional_id INT;
        
        SELECT @profesional_id = id 
        FROM profesionales 
        WHERE usuario_id = @usuario_id;
        -- Retornamos solo los pacientes asociados a la agenda de este médico
        SELECT DISTINCT p.*
        FROM Pacientes p
        INNER JOIN Turnos t ON p.id = t.paciente_id
        WHERE t.profesional_id = @profesional_id;
    END
    ELSE
    BEGIN
        -- Si no se pasa el parámetro (Admin), ejecutamos la consulta original
        SELECT * FROM Pacientes;
    END
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_GetPacientesMenuPrincipal]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_GetPacientesMenuPrincipal]
    @termino NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Buscamos en DNI, Nombre o Apellido y limitamos a 10 resultados por velocidad
    SELECT TOP 10 
        id, 
        nombre, 
        apellido, 
        dni, 
        telefono
    FROM dbo.pacientes
    WHERE dni LIKE '%' + @termino + '%'
       OR nombre LIKE '%' + @termino + '%'
       OR apellido LIKE '%' + @termino + '%'
    ORDER BY nombre, apellido;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetProfesional]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetProfesional]
    @id INT
AS
BEGIN
    SELECT * FROM profesionales WHERE id = @id;
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_GetProfesionales]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- 1. OBTENER LISTA DE MÉDICOS
CREATE PROCEDURE [dbo].[sp_GetProfesionales]
AS
BEGIN
    SELECT * FROM profesionales;
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_GetRoles]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- 1. OBTENER ROLES
CREATE PROCEDURE [dbo].[sp_GetRoles]
AS
BEGIN
    SELECT * FROM Roles;
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_GetTurnos]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

        CREATE PROCEDURE [dbo].[sp_GetTurnos]
            @UsuarioID INT,
            @RolCodigo NVARCHAR(20)
        AS
        BEGIN
            SET NOCOUNT ON;

            -- 1. Actualiza los turnos que ya terminaron (limpieza general)
            UPDATE Turnos
            SET estado = 'Completado'
            WHERE estado = 'Confirmado' 
              AND fecha_hora_fin <= GETDATE();

            -- 2. Variables para el filtro de seguridad
            DECLARE @ProfesionalID INT = NULL;

            -- 3. Si es un médico, buscamos cuál es su ID exacto en la tabla Profesionales
            IF @RolCodigo = 'MEDICO' 
            BEGIN
                SELECT @ProfesionalID = id 
                FROM Profesionales 
                WHERE usuario_id = @UsuarioID;
            END

            -- 4. Devuelve la lista con el filtro dinámico aplicado, incluyendo paciente_id y profesional_id
            SELECT 
                t.id, t.paciente_id, t.profesional_id, t.fecha_hora_inicio, t.fecha_hora_fin, t.estado, t.motivo_consulta, t.observaciones_admin,
                pr.nombre AS profesional_nombre, pr.apellido AS profesional_apellido,
                p.nombre AS paciente_nombre, p.apellido AS paciente_apellido
            FROM Turnos t
            INNER JOIN Profesionales pr ON t.profesional_id = pr.id
            INNER JOIN Pacientes p ON t.paciente_id = p.id
            WHERE 
                -- Filtro de seguridad dinámico
                (@RolCodigo <> 'MEDICO' OR t.profesional_id = @ProfesionalID)
            ORDER BY t.fecha_hora_inicio DESC;
        END;
    
GO
/****** Object:  StoredProcedure [dbo].[sp_GetUsuarioById]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetUsuarioById]
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        id,
        email,
        password_hash,
        rol_id,
        activo,
        fecha_creacion,
        username,
        debe_cambiar_pass
    FROM Usuarios
    WHERE id = @id;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetUsuarios]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- 1. OBTENER USUARIOS
CREATE PROCEDURE [dbo].[sp_GetUsuarios]
AS
BEGIN
    SELECT * FROM Usuarios;
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_LoginUsuario]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

            CREATE PROCEDURE [dbo].[sp_LoginUsuario]
                @username NVARCHAR(50)
            AS
            BEGIN
                SET NOCOUNT ON;

                SELECT 
                    u.id, 
                    u.username, 
                    u.password_hash, 
                    u.rol_id, 
                    u.debe_cambiar_pass,
                    r.codigo as rol_codigo, 
                    r.nombre as rol_nombre
                FROM Usuarios u
                INNER JOIN Roles r ON u.rol_id = r.id
                WHERE u.username = @username 
                  AND u.activo = 1;
            END;
        
GO
/****** Object:  StoredProcedure [dbo].[sp_RegistrarPagoTurno]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_RegistrarPagoTurno]
    @turno_id INT,
    @monto DECIMAL(10, 2),
    @metodo_pago VARCHAR(50),
    @usuario_registro_id INT = 1 -- Valor temporal por defecto si no viene del token
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Iniciar transacción SQL para asegurar consistencia
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- 1. Validar que el turno exista y esté pendiente de confirmación
        IF NOT EXISTS (SELECT 1 FROM dbo.turnos WHERE id = @turno_id)
        BEGIN
            RAISERROR ('El turno no existe.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- 2. Obtener el médico asignado a ese turno y su respectivo porcentaje de retención
        DECLARE @profesional_id INT;
        DECLARE @porcentaje_retencion DECIMAL(5,2);

        SELECT @profesional_id = profesional_id FROM dbo.turnos WHERE id = @turno_id;
        
        SELECT @porcentaje_retencion = porcentaje_retencion 
        FROM dbo.profesionales 
        WHERE id = @profesional_id;

        -- En caso de que no tenga retención seteada
        IF @porcentaje_retencion IS NULL SET @porcentaje_retencion = 20.00;

        -- 3. Buscar si existe una caja abierta hoy para el recepcionista
        DECLARE @caja_diaria_id INT = NULL;

        SELECT TOP 1 @caja_diaria_id = id 
        FROM dbo.caja_diaria 
        WHERE estado = 'Abierta' AND fecha = CAST(GETDATE() AS DATE)
        ORDER BY id DESC;

        -- 💡 Nota: Si @caja_diaria_id queda NULL (ej: pago digital por WhatsApp con n8n fuera del horario de recepción),
        -- el pago se registrará igual en la tabla 'pagos' pero sin asociarse a un cajón físico de hoy.

        -- 4. Insertar registro de auditoría en la tabla de pagos
        INSERT INTO dbo.pagos (turno_id, caja_diaria_id, monto_bruto, porcentaje_retencion, metodo_pago, fecha_pago, usuario_registro_id)
        VALUES (@turno_id, @caja_diaria_id, @monto, @porcentaje_retencion, @metodo_pago, GETDATE(), @usuario_registro_id);

        -- 5. Actualizar el estado del turno a Confirmado
        UPDATE dbo.turnos
        SET estado = 'Confirmado'
        WHERE id = @turno_id;

        COMMIT TRANSACTION;
        
        PRINT '✔️ Pago y Comisión registrados y turno Confirmado exitosamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR (@ErrorMessage, 16, 1);
    END CATCH
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_Set_CompartirHistorial]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_Set_CompartirHistorial]
    @historial_id INT,
    @profesional_invitado_id INT
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Validamos que no esté duplicado
    IF EXISTS (
        SELECT 1 FROM Permisos_Historial 
        WHERE historial_id = @historial_id 
          AND profesional_invitado_id = @profesional_invitado_id
    )
    BEGIN
        THROW 51004, 'Error: El profesional ya tiene acceso a esta evolución.', 1;
    END

    -- 2. Si pasa la prueba, lo insertamos
    INSERT INTO Permisos_Historial (historial_id, profesional_invitado_id) 
    VALUES (@historial_id, @profesional_invitado_id);
END

GO
/****** Object:  StoredProcedure [dbo].[sp_SetAdministrativo]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_SetAdministrativo]
    @id INT,
    @usuarioId INT,
    @nombre NVARCHAR(100),
    @apellido NVARCHAR(100)
AS
BEGIN
    UPDATE Administrativos
    SET usuario_id = @usuarioId,
        nombre = @nombre,
        apellido = @apellido
    WHERE id = @id;
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_SetHistorialesClinicos]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_SetHistorialesClinicos]
    @id INT,
    @motivo NVARCHAR(255),
    @evolucion NVARCHAR(MAX),
    @diagnostico NVARCHAR(255),
    @tratamiento NVARCHAR(MAX),
    @archivosAdjuntosUrl NVARCHAR(MAX)
AS
BEGIN
    UPDATE historial_clinico
    SET 
    motivo = @motivo,
        evolucion = @evolucion,
        diagnostico = @diagnostico,
        tratamiento = @tratamiento,
        archivos_adjuntos_url = @archivosAdjuntosUrl
    WHERE id = @id;
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_SetPaciente]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

        CREATE PROCEDURE [dbo].[sp_SetPaciente]
            @id INT,
            @nombre NVARCHAR(100),
            @apellido NVARCHAR(100),
            @dni NVARCHAR(20),
            @email NVARCHAR(100),
            @telefono NVARCHAR(20),
            @fecha_nacimiento DATE = NULL,
            @obra_social_id INT = NULL,
            @numero_afiliado NVARCHAR(100) = NULL,
            @sexo NVARCHAR(50) = NULL,
            @grupo_sanguineo NVARCHAR(20) = NULL,
            @direccion NVARCHAR(255) = NULL,
            @contacto_emergencia NVARCHAR(255) = NULL,
            @alergias NVARCHAR(1000) = NULL
        AS
        BEGIN
            SET NOCOUNT ON;

            UPDATE Pacientes
            SET nombre = @nombre,
                apellido = @apellido,
                dni = @dni,
                email = @email,
                telefono = @telefono,
                fecha_nacimiento = @fecha_nacimiento,
                obra_social = CAST(@obra_social_id AS VARCHAR(100)),
                obra_social_id = @obra_social_id,
                numero_afiliado = @numero_afiliado,
                sexo = @sexo,
                grupo_sanguineo = @grupo_sanguineo,
                direccion = @direccion,
                contacto_emergencia = @contacto_emergencia,
                alergias = @alergias
            WHERE id = @id;
        END;
    
GO
/****** Object:  StoredProcedure [dbo].[sp_SetProfesional]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

        CREATE PROCEDURE [dbo].[sp_SetProfesional]
            @id INT,
            @nombre NVARCHAR(100),
            @apellido NVARCHAR(100),
            @matricula NVARCHAR(50),
            @especialidad NVARCHAR(100),
            @telefono NVARCHAR(50),
            @duracionTurnoPromedio INT,
            @porcentajeRetencion DECIMAL(5,2) = 20.00,
            @tipoMatricula NVARCHAR(20) = NULL,
            @cuitCuil NVARCHAR(20) = NULL
        AS
        BEGIN
            SET NOCOUNT ON;

            UPDATE profesionales
            SET nombre = @nombre,
                apellido = @apellido,
                matricula = @matricula,
                especialidad = @especialidad,
                telefono = @telefono,
                duracion_turno_promedio = @duracionTurnoPromedio,
                porcentaje_retencion = @porcentajeRetencion,
                tipo_matricula = @tipoMatricula,
                cuit_cuil = @cuitCuil
            WHERE id = @id;
        END;
    
GO
/****** Object:  StoredProcedure [dbo].[sp_SetRoles]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_SetRoles]
    @id INT,
    @nombre NVARCHAR(50),
    @codigo NVARCHAR(20)
AS
BEGIN
    UPDATE Roles
    SET nombre = @nombre,
        codigo = @codigo
    WHERE id = @id;
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_SetTurno]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_SetTurno]
   @id                  int,
   @profesional_id      int,
   @paciente_id         int,
   @fecha_hora_inicio   datetime,
   @fecha_hora_fin      datetime,
   @estado              varchar (20),
   @motivo_consulta     nvarchar (300),
   @observaciones_admin nvarchar (300)
AS
BEGIN
    SET NOCOUNT ON;

    IF @fecha_hora_inicio < GETDATE()
    BEGIN
        THROW 51004, 'Error: No se puede modificar el turno hacia una fecha u hora del pasado.', 1;
    END

    -- Validación básica (que el fin no sea antes que el inicio)
    IF @fecha_hora_fin <= @fecha_hora_inicio
    BEGIN
        THROW 51001, 'Error: La fecha y hora de fin debe ser posterior al inicio.', 1;
    END

    -- (Eliminamos la restricción de los 40 minutos fijos porque ahora el tiempo es dinámico)

    -- Actualización del turno
    UPDATE turnos
    SET 
        profesional_id = @profesional_id,            
        paciente_id = @paciente_id,            
        fecha_hora_inicio = @fecha_hora_inicio,    
        fecha_hora_fin = @fecha_hora_fin,        
        estado = @estado,                
        motivo_consulta = @motivo_consulta,        
        observaciones_admin = @observaciones_admin
    WHERE id = @id;

END
GO
/****** Object:  StoredProcedure [dbo].[sp_SetUsuario]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_SetUsuario]
    @id INT,
    @email NVARCHAR(100),
    @passwordHash NVARCHAR(255),
    @rolId INT,
    @activo BIT,
    @username VARCHAR(100),
    @debeCambiarPass BIT
AS
BEGIN
    UPDATE Usuarios
    SET email = @email,
        password_hash = @passwordHash,
        rol_id = @rolId,
        activo = @activo,
        username = @username,
        debe_cambiar_pass = @debeCambiarPass
    WHERE id = @id;
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_UploadArchivo]    Script Date: 28/5/2026 01:11:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_UploadArchivo]
    @paciente_id INT,
    @turno_id INT = NULL,
    @nombre_original NVARCHAR(255),
    @nombre_archivo NVARCHAR(255),
    @tipo_archivo NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.archivos_medicos (paciente_id, turno_id, nombre_original, nombre_archivo, tipo_archivo)
    VALUES (@paciente_id, @turno_id, @nombre_original, @nombre_archivo, @tipo_archivo);
END
GO
